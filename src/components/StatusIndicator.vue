<script setup>
defineProps({
  status: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="status-container">
    <h2 class="chat-title">聊天框</h2>
    <p class="status-text">Status: {{ status }}</p>
    <div
      class="status-dot"
      :class="{ connected: status === 'connected', disconnected: status !== 'connected' }"
    ></div>
  </div>
</template>

<style scoped>
.status-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.chat-title {
  font-size: 18px;
  font-weight: bold;
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
</style>
