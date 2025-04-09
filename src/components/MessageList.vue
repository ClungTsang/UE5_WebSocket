<script setup>
import { marked } from 'marked';
defineProps({
  messages: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="message-container">
    <div 
      v-for="(msg, index) in messages" 
      :key="index" 
      :class="{
        'sending-message': msg.type === 'sending',
        'sent-message': msg.type === 'sent',
        'received-message': msg.type === 'received',
      }" 
      class="message"
    >
      <div class="message-time">{{ msg.time }}</div>
      <div class="message-content">
        <span v-if="msg.type === 'sending'">发送中...</span>
        <span v-else-if="msg.type === 'sent'">{{ msg.content }}</span>
        <div v-else-if="msg.type === 'received'" v-html="marked(msg.content)"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-container {
  height: 100%;
  overflow-y: auto;
  padding: 10px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.message-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
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

.sending-message {
  background-color: #f3f4f6;
  color: #6b7280;
}

.sent-message .message-content {
  background-color: #95ec69;
  border-top-right-radius: 0;
  word-wrap: break-word;
}
</style>