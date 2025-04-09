<script setup>
// 导入Vue相关API
import { ref, onMounted, onUnmounted } from "vue";

// 消息列表，存储所有发送和接收的消息
const messages = ref([]);
// 当前输入框中的消息内容
const inputMessage = ref("");
// WebSocket连接实例
const socket = ref(null);
// 当前连接状态：connected/disconnected
const status = ref("disconnected");

// WebSocket服务器IP地址，默认为192.168.1.13:8080
const server = ref("toolin.cn/echo");

// 连接WebSocket服务器
const connect = () => {
  // 如果已连接则直接返回
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    return;
  }
  
  // 如果存在旧连接则先关闭
  if (socket.value) {
    socket.value.close();
  }
  
  // 清空消息和输入
  clearMessages();
  inputMessage.value = "";
  
  // 根据当前环境自动选择协议
  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  // 创建新的WebSocket连接
  socket.value = new WebSocket(`${protocol}${server.value}`);

  // WebSocket连接成功回调
  socket.value.onopen = () => {
    status.value = "connected";
    console.log("WebSocket connected");
  };

  // 接收到WebSocket消息回调
  socket.value.onmessage = (event) => {
    console.log('event', event);
    // 过滤掉打字状态通知消息
    if (event.data !== 'TYPING_START' && event.data !== 'TYPING_END') {
      // 构造接收消息对象并添加到消息列表
      const message = {
        content: event.data,
        type: 'received',
        time: new Date().toLocaleTimeString()
      };
      messages.value.push(message);
    }
  };

  // WebSocket连接关闭回调
  socket.value.onclose = () => {
    status.value = "disconnected";
    console.log("WebSocket disconnected");
  };
};



// 发送普通文本消息
const sendMessage = () => {
  // 检查WebSocket连接是否已建立
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    // 构造发送消息对象
    const message = {
      content: inputMessage.value,
      type: 'sent',
      time: new Date().toLocaleTimeString()
    };
    // 发送消息
    socket.value.send(inputMessage.value);
    // 将消息添加到消息列表
    messages.value.push(message);
    // 清空输入框
    inputMessage.value = "";

  }
};

// 发送颜色消息
const sendColorMessage = (color) => {
  // 检查WebSocket连接是否已建立
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    // 构造颜色消息对象
    const message = {
      content: color,
      type: 'sent',
      time: new Date().toLocaleTimeString()
    };
    // 发送颜色消息
    socket.value.send(color);
    // 将消息添加到消息列表
    messages.value.push(message);
  }
};

// 断开WebSocket连接
const disconnect = () => {
  if (socket.value) {
    // 关闭WebSocket连接
    socket.value.close();
  }
  
  // 清空消息和输入
  clearMessages();
  inputMessage.value = "";
};

// 清空消息列表
const clearMessages = () => {
  messages.value = [];
};

// 组件挂载时自动连接WebSocket
onMounted(() => {
  connect();
});

// 组件卸载时断开WebSocket连接
onUnmounted(() => {
  disconnect();
});
</script>

<template>
  <div class="chat-container">
    <h2 class="chat-title">聊天框</h2>
    <div class="status-container">
  <p class="status-text">Status: {{ status }}</p>
  <div class="status-dot" :class="{ connected: status === 'connected', disconnected: status !== 'connected' }"></div>

</div>

    <div class="input-group">
      <input
        v-model="server"
        placeholder="124.222.6.60:8800 或者 toolin.cn/echo"
      />
      <button
        class="connect-btn"
        @click="connect"
      >
        连接
      </button>
      <button
        class="disconnect-btn"
        @click="disconnect"
      >
        关闭
      </button>
    </div>

    <div class="color-buttons">
      <button
        class="red-btn"
        @click="sendColorMessage('红色')"
      >
        红色
      </button>
      <button
        class="yellow-btn"
        @click="sendColorMessage('黄色')"
      >
        黄色
      </button>
      <button
        class="blue-btn"
        @click="sendColorMessage('蓝色')"
      >
        蓝色
      </button>
    </div>
    <div class="message-input">
      <input
        v-model="inputMessage"
        @keyup.enter="sendMessage"
        @input="handleTyping"
        placeholder="输入消息..."
      />
      <button
        class="send-btn"
        @click="sendMessage"
      >
        发送
      </button>
      <button
        class="clear-btn"
        @click="clearMessages"
      >
        清空
      </button>
    </div>

    <div class="max-h-[300px] overflow-y-auto border border-gray-200 p-2.5 mt-2.5">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="{
          'bg-gray-100 text-gray-500': msg.type === 'sending',
          'sent-message': msg.type === 'sent',
          'received-message': msg.type === 'received',
        }"
        class="message"
      >
        <div class="message-time">{{ msg.time }}</div>
        <div class="message-content">
          <span v-if="msg.type === 'sending'">发送中...</span>
          <span v-else-if="msg.type === 'sent'">{{ msg.content }}</span>
          <div v-else-if="msg.type === 'received'" v-html="msg.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.chat-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.status-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.status-text {
  color: #666;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-dot.connected {
  background-color: #07c160;
  animation: pulse 2s infinite;
}

.status-dot.disconnected {
  background-color: #ff4d4f;
}



@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.input-group input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.connect-btn {
  padding: 8px 16px;
  background-color: #07c160;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.disconnect-btn {
  padding: 8px 16px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.color-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.red-btn {
  flex: 1;
  padding: 8px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
}

.yellow-btn {
  flex: 1;
  padding: 8px;
  background-color: #faad14;
  color: white;
  border: none;
  border-radius: 4px;
}

.blue-btn {
  flex: 1;
  padding: 8px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
}

.message-input {
  display: flex;
  gap: 10px;
}

.message-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.send-btn, .clear-btn {
  padding: 8px 16px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-btn {
  background-color: #07c160;
}

.clear-btn {
  background-color: #ff4d4f;
  margin-left: 10px;
}

.message-list {
  padding: 10px;
  height: 400px;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.message-time {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin: 5px 0;
}

.message-content {
  max-width: 100%;
  padding: 8px 12px;
  border-radius: 18px;
  position: relative;
}

.received-message {
  align-self: flex-start;
  max-width: 50%;
  margin-right: auto;
}

.sent-message {
  align-self: flex-end;
  max-width: 50%;
  margin-left: auto;
}

.received-message .message-content {
  background-color: white;
  border-top-left-radius: 0;
  word-wrap: break-word;
}

.sent-message .message-content {
  background-color: #95ec69;
  border-top-right-radius: 0;
  word-wrap: break-word;
}
</style>
