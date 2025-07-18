// src/composables/useAuth.js
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { loginUser, registerUser, fetchUserById } from '../api'; // 導入 API 函數
import { useNotification } from './useNotification'; // 導入通知 composable

const currentUserId = ref(localStorage.getItem('currentUserId') ? parseInt(localStorage.getItem('currentUserId')) : null);
const currentUserRole = ref(localStorage.getItem('currentUserRole') || null);

export function useAuth() {
  const router = useRouter();
  const { showSuccess, showError } = useNotification(); // 使用通知

  const isLoggedIn = computed(() => currentUserId.value !== null);
  const isAdmin = computed(() => currentUserRole.value === 'admin');

  // 登入函數，現在會呼叫後端 API
  async function login(email, password) {
    try {
      const { user_id, user_role } = await loginUser(email, password);
      currentUserId.value = user_id;
      currentUserRole.value = user_role;
      localStorage.setItem('currentUserId', user_id);
      localStorage.setItem('currentUserRole', user_role);
      showSuccess('登入成功！');
      return true; // 登入成功
    } catch (error) {
      console.error('登入失敗:', error);
      showError(error.detail || '登入失敗，請檢查您的帳號和密碼。');
      return false; // 登入失敗
    }
  }

  // 註冊函數，現在會呼叫後端 API
  async function register(userData) {
    try {
      await registerUser(userData);
      showSuccess('註冊成功！請登入。');
      return true; // 註冊成功
    } catch (error) {
      console.error('註冊失敗:', error);
      showError(error.detail || '註冊失敗，請稍後再試。');
      return false; // 註冊失敗
    }
  }

  // 登出函數
  function logout() {
    // 清除 localStorage 中的所有相關資訊
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserRole');
    // 由於 token 是以 user_id 為 key 儲存的，我們需要遍歷並移除所有 token
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('token_')) {
        localStorage.removeItem(key);
      }
    }

    currentUserId.value = null;
    currentUserRole.value = null;
    router.push('/account/signin'); // 登出後導向登入頁面
    showSuccess('您已成功登出。');
  }

  // 檢查用戶是否已登入並獲取用戶資訊 (可選，如果需要自動登入或刷新 token)
  async function checkAuthStatus() {
    console.log('checkAuthStatus: 正在檢查認證狀態...');
    const storedUserId = localStorage.getItem('currentUserId');
    const storedUserRole = localStorage.getItem('currentUserRole');
    const token = storedUserId ? localStorage.getItem(`token_${storedUserId}`) : null;

    console.log(`checkAuthStatus: storedUserId = ${storedUserId}, storedUserRole = ${storedUserRole}, token exists = ${!!token}`);

    if (storedUserId && storedUserRole && token) {
      try {
        // 嘗試獲取用戶資料，驗證 token 是否有效
        console.log('checkAuthStatus: 嘗試透過 fetchUserById 驗證 token...');
        await fetchUserById(); // fetchUserById 現在會自動使用 token
        currentUserId.value = parseInt(storedUserId);
        currentUserRole.value = storedUserRole;
        console.log('checkAuthStatus: Token 有效，用戶已登入。');
      } catch (error) {
        console.error('checkAuthStatus: Token 無效或過期，自動登出:', error);
        logout(); // Token 無效則自動登出
      }
    } else {
      console.log('checkAuthStatus: 無有效儲存的用戶資訊或 token，執行登出。');
      logout(); // 沒有儲存的用戶資訊或 token，則登出
    }
  }

  return {
    currentUserId,
    currentUserRole,
    isLoggedIn,
    isAdmin,
    login,
    register, // 導出 register 函數
    logout,
    checkAuthStatus, // 導出 checkAuthStatus 函數
  };
}