import { useRouter } from 'vue-router';
import { useNotification } from '@/composables/useNotification.js'; // 導入通知 composable
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginUser, registerUser, fetchUserById, logoutUser } from '../api'; // 引入 logoutUser

export const useAuthStore = defineStore('auth', () => {
  const { showSuccess, showError } = useNotification(); // 使用通知
  const router = useRouter();
  const currentUserId = ref(localStorage.getItem('currentUserId') ? parseInt(localStorage.getItem('currentUserId')) : null);
  const currentUserRole = ref(localStorage.getItem('currentUserRole') || null);

  const isLoggedIn = computed(() => currentUserId.value !== null);
  const isAdmin = computed(() => currentUserRole.value === 'admin');

  async function login(email, password) {
    try {
      const { user_id, user_role } = await loginUser(email, password);
      currentUserId.value = user_id;
      currentUserRole.value = user_role;
      localStorage.setItem('currentUserId', user_id);
      localStorage.setItem('currentUserRole', user_role);
      return true;
    } catch (error) {
      console.error('登入失敗:', error);
      throw error; // 拋出錯誤以便上層處理通知
    }
  }

  async function register(userData) {
    try {
      await registerUser(userData);
      return true;
    } catch (error) {
      console.error('註冊失敗:', error);
      throw error; // 拋出錯誤以便上層處理通知
    }
  }

  async function logout() { // 將 logout 函數改為 async
    try {
      await logoutUser(); // 呼叫後端登出 API
      router.push('/account/signin'); // 登出後導向登入頁面
      showSuccess('您已成功登出。');
    } catch (error) {
      console.error('登出 API 呼叫失敗:', error);
      // 即使 API 呼叫失敗，前端也應該清除本地狀態，確保用戶登出
    }
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserRole');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('token_')) {
        localStorage.removeItem(key);
      }
    }
    currentUserId.value = null;
    currentUserRole.value = null;
  }

  async function checkAuthStatus() {
    const storedUserId = localStorage.getItem('currentUserId');
    const storedUserRole = localStorage.getItem('currentUserRole');
    const token = storedUserId ? localStorage.getItem(`token_${storedUserId}`) : null;

    if (storedUserId && storedUserRole && token) {
      try {
        await fetchUserById();
        currentUserId.value = parseInt(storedUserId);
        currentUserRole.value = storedUserRole;
      } catch (error) {
        console.error('checkAuthStatus: Token 無效或過期，自動登出:', error);
        logout();
        throw error; // 拋出錯誤以便上層處理通知
      }
    } else {
      logout();
    }
  }

  return {
    currentUserId,
    currentUserRole,
    isLoggedIn,
    isAdmin,
    login,
    register,
    logout,
    checkAuthStatus,
  };
});