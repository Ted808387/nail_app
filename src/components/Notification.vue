<template>
  <transition name="slide-fade">
    <div v-if="isVisible" :class="['fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white z-[100]', notificationTypeClass]">
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';
import { useNotification } from '@/composables/useNotification.js';

const { message, type, isVisible } = useNotification();

const notificationTypeClass = computed(() => {
  return type.value === 'success' ? 'bg-green-500' : 'bg-red-500';
});
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>