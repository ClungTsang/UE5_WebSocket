import { ref, onMounted, onUnmounted, watch } from "vue";
import OpenAI from "openai";

export default function useChat() {
  // 消息列表，存储所有发送和接收的消息
  const messages = ref([]);
  // 当前输入框中的消息内容
  const inputMessage = ref("");
  // WebSocket连接实例
  const socket = ref(null);
  // 当前连接状态：connected/disconnected
  const status = ref("disconnected");
  // AI聊天模式状态
  const aiMode = ref(true);
  // 监听aiMode变化
  watch(
    aiMode,
    (newVal) => {
      if (socket.value && socket.value.readyState === WebSocket.OPEN) {
        disconnect();
      }
      messages.value = [];

      if (newVal) {
        const welcomeMessage = {
          content: "麻古麻古，duang！",
          type: "received",
          time: new Date().toLocaleTimeString(),
        };
        messages.value.push(welcomeMessage);
      } else {
        connect();
      }
    },
    { immediate: true }
  );
  // 当前选择的AI服务
  const currentAI = ref("deepseek");
  // 当前选择的DeepSeek模型版本
  const currentModel = ref("deepseek-chat");
  // 加载状态
  const isLoading = ref(false);
  // WebSocket服务器地址
  const server = ref("toolin.cn/echo");

  // 连接WebSocket服务器
  const connect = () => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      return;
    }

    if (socket.value) {
      socket.value.close();
    }

    inputMessage.value = "";
    const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
    socket.value = new WebSocket(`${protocol}${server.value}`);

    socket.value.onopen = () => {
      status.value = "connected";
      console.log("WebSocket connected");
    };

    socket.value.onmessage = (event) => {
      console.log("event", event);
      if (event.data !== "TYPING_START" && event.data !== "TYPING_END") {
        const message = {
          content: event.data,
          type: "received",
          time: new Date().toLocaleTimeString(),
        };
        messages.value.push(message);
      }
    };

    socket.value.onclose = () => {
      status.value = "disconnected";
      console.log("WebSocket disconnected");
    };
  };

  // 发送颜色消息
  const sendColorMessage = (color) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      const message = {
        content: color,
        type: "sent",
        time: new Date().toLocaleTimeString(),
      };
      socket.value.send(color);
      messages.value.push(message);
    }
  };

  // 断开WebSocket连接
  const disconnect = () => {
    if (socket.value) {
      socket.value.close();
      socket.value = null;
    }
    status.value = "disconnected";
  };

  // 调用DeepSeek API进行流式聊天
  const callDeepSeekAPI = async (message) => {
    isLoading.value = true;
    try {
      const openai = new OpenAI({
        baseURL: "https://api.deepseek.com",
        apiKey: "sk-3cc63013426a4c5b91e3843779882830",
        dangerouslyAllowBrowser: true,
      });

      const conversationHistory = messages.value
        .filter((msg) => msg.type === "sent" || msg.type === "received")
        .map((msg) => ({
          role: msg.type === "sent" ? "user" : "assistant",
          content: msg.content,
        }));

      conversationHistory.push({ role: "user", content: message });

      const stream = await openai.chat.completions.create({
        model: currentModel.value,
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 2048,
        stream: true,
      });

      let aiMessage = {
        content: "",
        type: "received",
        time: new Date().toLocaleTimeString(),
      };
      messages.value.push(aiMessage);

      for await (const chunk of stream) {
        if (chunk.choices[0]?.delta?.content) {
          aiMessage.content += chunk.choices[0].delta.content;
          messages.value = [...messages.value];
        }
      }
    } catch (error) {
      console.error("DeepSeek API error:", error);
      let errorMessage = "DeepSeek API调用失败";
      if (error.status === 402) {
        errorMessage = "API密钥无效或账户余额不足，请检查您的DeepSeek账户";
      } else if (error.status === 429) {
        errorMessage = "请求过于频繁，请稍后再试";
      } else if (error.status === 401) {
        errorMessage = "API密钥无效，请检查您的DeepSeek API密钥";
      }
      messages.value.push({
        content: errorMessage,
        type: "received",
        time: new Date().toLocaleTimeString(),
      });
      isLoading.value = false;
    }
  };

  // 发送消息
  const sendMessage = () => {
    if (aiMode.value) {
      callDeepSeekAPI(inputMessage.value);
      const message = {
        content: inputMessage.value,
        type: "sent",
        time: new Date().toLocaleTimeString(),
      };
      messages.value.push(message);
      inputMessage.value = "";
    } else {
      if (socket.value && socket.value.readyState === WebSocket.OPEN) {
        const message = {
          content: inputMessage.value,
          type: "sent",
          time: new Date().toLocaleTimeString(),
        };
        socket.value.send(inputMessage.value);
        messages.value.push(message);
        inputMessage.value = "";
      }
    }
    if (aiMode.value && socket.value) {
      socket.value.close();
    }
    inputMessage.value = "";
  };

  // 清空消息列表
  const clearMessages = () => {
    messages.value = [];
  };

  // 生命周期钩子
  // onMounted(() => {
  //   connect();
  // });

  onUnmounted(() => {
    disconnect();
  });

  return {
    messages,
    inputMessage,
    socket,
    status,
    aiMode,
    currentAI,
    currentModel,
    isLoading,
    server,
    connect,
    disconnect,
    sendColorMessage,
    sendMessage,
    clearMessages,
  };
}
