import { ref, readonly } from 'vue';

// Create a single, shared state at the module level.
const message = ref('');
const type = ref('info');
const isVisible = ref(false);
let timeoutId = null;

// The composable function that provides access to the shared state.
export function useNotification() {
  const showNotification = (msg, notificationType = 'info', duration = 3000) => {
    message.value = msg;
    type.value = notificationType;
    isVisible.value = true;

    // Clear any existing timeout to reset the timer
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a timeout to hide the notification
    timeoutId = setTimeout(() => {
      isVisible.value = false;
    }, duration);
  };

  const showSuccess = (msg, dur = 3000) => {
    showNotification(msg, 'success', dur);
  };

  const showError = (msg, dur = 3000) => {
    showNotification(msg, 'error', dur);
  };

  return {
    // Return readonly versions of the state to prevent direct mutation from components
    message: readonly(message),
    type: readonly(type),
    isVisible: readonly(isVisible),
    
    // Return the methods to change the state
    showSuccess,
    showError,
  };
}