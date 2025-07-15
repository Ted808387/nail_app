import { ref, readonly } from 'vue';

const message = ref('');
const type = ref('info');
const duration = ref(3000);

let notificationTimeout = null;

function showNotification(msg, notificationType = 'info', notificationDuration = 3000) {
  message.value = msg;
  type.value = notificationType;
  duration.value = notificationDuration;

  // 清除之前的定時器
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }

  // 設置新的定時器來清除訊息
  notificationTimeout = setTimeout(() => {
    message.value = '';
  }, duration.value);
}

export function useNotification() {
  return {
    message: readonly(message),
    type: readonly(type),
    duration: readonly(duration),
    showNotification,
    showSuccess: (msg, dur = 3000) => showNotification(msg, 'success', dur),
    showError: (msg, dur = 3000) => showNotification(msg, 'error', dur),
    showInfo: (msg, dur = 3000) => showNotification(msg, 'info', dur),
  };
}
