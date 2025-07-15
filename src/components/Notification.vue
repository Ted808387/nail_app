<template>
  <transition name="fade">
    <div
      v-if="isVisible"
      :class="['fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 flex items-center space-x-3', notificationClass]"
      role="alert"
    >
      <svg v-if="type === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <svg v-if="type === 'error'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <svg v-if="type === 'info'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      
      <span>{{ message }}</span>
      <button @click="hide" class="ml-auto text-white opacity-75 hover:opacity-100 focus:outline-none">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'info', // 'success', 'error', 'info'
  },
  duration: {
    type: Number,
    default: 3000, // 3秒後自動關閉
  },
});

const isVisible = ref(false);
let timeoutId = null;

const notificationClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-500';
    case 'error':
      return 'bg-red-500';
    case 'info':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
});

const show = () => {
  isVisible.value = true;
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    hide();
  }, props.duration);
};

const hide = () => {
  isVisible.value = false;
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
};

// 監聽 message 變化，當 message 不為空時顯示通知
watch(() => props.message, (newMessage) => {
  if (newMessage) {
    show();
  }
});

defineExpose({ show, hide }); // 暴露 show 和 hide 方法給父組件調用
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
