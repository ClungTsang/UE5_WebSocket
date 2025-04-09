<script setup>
import MessageList from "@/components/MessageList.vue";
import MessageInput from "@/components/MessageInput.vue";
import ColorButtons from "@/components/ColorButtons.vue";
import StatusIndicator from "@/components/StatusIndicator.vue";
import useChat from '@/hooks/useChat';

const {
  messages,
  inputMessage,
  status,
  aiMode,
  currentModel,
  server,
  connect,
  disconnect,
  sendColorMessage,
  sendMessage,
  clearMessages
} = useChat();
</script>

<template>
  <div class="chat-container">

    <StatusIndicator :status="status" v-if="!aiMode" />

    <div class="input-group" v-if="!aiMode">
      <input v-model="server" placeholder="toolin.cn/echo" />
      <button class="connect-btn" @click="connect">
        连接
      </button>
      <button class="disconnect-btn" @click="disconnect">
        关闭
      </button>
    </div>

    <ColorButtons @send-color="sendColorMessage" v-if="!aiMode" />

    <MessageList :messages="messages" />

    <MessageInput :model-value="inputMessage" @update:model-value="val => inputMessage = val" @send="sendMessage"
      @clear="clearMessages" :ai-mode="aiMode" @update:ai-mode="val => aiMode = val"
      v-model:current-model="currentModel" />

  </div>

</template>

<style scoped>
.chat-container {
  max-width: 600px;
  height: 90vh;
  padding: 20px;
  margin: 0 auto;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
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
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
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
  margin-top: auto;
  padding-bottom: 10px;
  position: sticky;
  bottom: 0;
  background-color: #f5f5f5;
}

.message-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.send-btn,
.clear-btn {
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

.ai-toggle-btn {
  background-color: #722ed1;
  margin-left: 10px;
}

.ai-selector {
  margin-left: 10px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.message-list {
  padding: 10px;
  flex-grow: 1;
  overflow-y: auto;
  max-height: calc(100% - 200px);
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
