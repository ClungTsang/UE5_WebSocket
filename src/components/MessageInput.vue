<script setup>
import { computed } from "vue";
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  aiMode: {
    type: Boolean,
    default: false,
  },
  currentModel: {
    type: String,
    default: "deepseek-chat",
  },
});

const emit = defineEmits(["update:modelValue", "send", "clear", "update:aiMode", "update:currentModel"]);

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const aiModeComputed = computed({
  get: () => props.aiMode,
  set: (value) => emit("update:aiMode", value),
});

const currentModelComputed = computed({
  get: () => props.currentModel,
  set: (value) => emit("update:currentModel", value),
});

const handleKeyUp = (event) => {
  if (event.key === "Enter") {
    emit("send");
  }
};
</script>

<template>
  <div class="message-input">
    <input
      v-model="model"
      @keyup.enter="handleKeyUp"
      placeholder="輸入消息..."
    />
    <button
      class="send-btn"
      @click="$emit('send')"
    >
      發送
    </button>
    <button
      class="ai-toggle-btn"
      @click="aiModeComputed = !aiModeComputed"
    >
      {{ aiModeComputed ? "切換WebSocket" : "切換AI聊天" }}
    </button>
    <select
      v-model="currentModelComputed"
      class="ai-selector"
      v-if="aiModeComputed"
    >
      <optgroup label="通用模型">
        <option value="deepseek-chat">DeepSeek-V3</option>
      </optgroup>
      <optgroup label="專業模型">
        <option value="deepseek-coder">DeepSeek Coder</option>
        <option value="deepseek-reasoner">DeepSeek-R1</option>
      </optgroup>
    </select>
  </div>
</template>

<style scoped>
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

.send-btn,
.clear-btn,
.ai-toggle-btn {
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
  background-color: #1890ff;
  margin-left: 10px;
}

.ai-selector {
  margin-left: 10px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  width: 140px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ai-selector:hover {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.ai-selector:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

optgroup {
  font-weight: bold;
  color: #666;
}

option {
  padding: 8px 12px;
}
</style>
