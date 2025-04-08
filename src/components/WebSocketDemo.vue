<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const messages = ref([]);
const inputMessage = ref("");
const socket = ref(null);
const status = ref("disconnected");

const serverIp = ref("192.168.1.13");
const serverPort = ref("8088");

const connect = () => {
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    return;
  }
  
  if (socket.value) {
    socket.value.close();
  }
  
  socket.value = new WebSocket(`ws://${serverIp.value}:${serverPort.value}`);

  socket.value.onopen = () => {
    status.value = "connected";
    console.log("WebSocket connected");
  };

  socket.value.onmessage = (event) => {
    console.log('event', event);
    if (event.data !== 'TYPING_START' && event.data !== 'TYPING_END') {
      const message = {
        content: event.data,
        type: 'received',
        time: new Date().toLocaleTimeString()
      };
      messages.value.push(message);
    }
  };

  socket.value.onclose = () => {
    status.value = "disconnected";
    console.log("WebSocket disconnected");
  };
};



const sendMessage = () => {
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    const message = {
      content: inputMessage.value,
      type: 'sent',
      time: new Date().toLocaleTimeString()
    };
    socket.value.send(inputMessage.value);
    messages.value.push(message);
    inputMessage.value = "";

  }
};

const sendColorMessage = (color) => {
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    const message = {
      content: color,
      type: 'sent',
      time: new Date().toLocaleTimeString()
    };
    socket.value.send(color);
    messages.value.push(message);
  }
};

const disconnect = () => {
  if (socket.value) {
    socket.value.close();
  }
};

const clearMessages = () => {
  messages.value = [];
};

onMounted(() => {
  connect();
});

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
        v-model="serverIp"
        placeholder="Server IP"
      />
      <input
        v-model="serverPort"
        placeholder="Port"
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
          <span v-else-if="msg.type === 'received'">{{ msg.content }}</span>
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
