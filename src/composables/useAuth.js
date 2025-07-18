// src/composables/useAuth.js
import { useRouter } from 'vue-router';
import { useNotification } from './useNotification'; // 導入通知 composable
import { useAuthStore } from '../stores/auth'; // 導入 Pinia 的 auth store

export function useAuth() {
  const router = useRouter();
  const { showSuccess, showError } = useNotification(); // 使用通知
  const authStore = useAuthStore(); // 使用 Pinia store

  // 登入函數，現在會呼叫 Pinia store 的 login action
  async function login(email, password) {
    try {
      await authStore.login(email, password);
      showSuccess('登入成功！');
      return true; // 登入成功
    } catch (error) {
      console.error('登入失敗:', error);
      showError(error.detail || '登入失敗，請檢查您的帳號和密碼。');
      return false; // 登入失敗
    }
  }

  // 註冊函數，現在會呼叫 Pinia store 的 register action
  async function register(userData) {
    try {
      await authStore.register(userData);
      showSuccess('註冊成功！請登入。');
      return true; // 註冊成功
    } catch (error) {
      console.error('註冊失敗:', error);
      showError(error.detail || '註冊失敗，請稍後再試。');
      return false; // 註冊失敗
    }
  }

  // 登出函數，現在會呼叫 Pinia store 的 logout action
  async function logout() {
    await authStore.logout();
    router.push('/account/signin'); // 登出後導向登入頁面
    showSuccess('您已成功登出。');
  }

  // 檢查用戶是否已登入並獲取用戶資訊，現在會呼叫 Pinia store 的 checkAuthStatus action
  async function checkAuthStatus() {
    try {
      await authStore.checkAuthStatus();
    } catch (error) {
      // checkAuthStatus 內部會處理登出和錯誤，這裡不需要額外處理
      console.error('checkAuthStatus 處理錯誤:', error);
    }
  }

  return {
    currentUserId: authStore.currentUserId,
    currentUserRole: authStore.currentUserRole,
    isLoggedIn: authStore.isLoggedIn,
    isAdmin: authStore.isAdmin,
    login,
    register,
    logout,
    checkAuthStatus,
  };
}