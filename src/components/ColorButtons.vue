<script setup>
const emit = defineEmits(['send-color']);

const sendColor = (color) => {
  emit('send-color', color);
};
</script>

<template>
  <div class="color-buttons">
    <button class="red-btn" @click="sendColor('红色')">
      红色
    </button>
    <button class="yellow-btn" @click="sendColor('黄色')">
      黄色
    </button>
    <button class="blue-btn" @click="sendColor('蓝色')">
      蓝色
    </button>
  </div>
</template>

<style scoped>
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
</style>