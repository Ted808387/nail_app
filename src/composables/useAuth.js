// src/composables/useAuth.js
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const currentUserId = ref(localStorage.getItem('currentUserId') ? parseInt(localStorage.getItem('currentUserId')) : null);
const currentUserRole = ref(localStorage.getItem('currentUserRole') || null);

export function useAuth() {
  const router = useRouter();

  const isLoggedIn = computed(() => currentUserId.value !== null);
  const isAdmin = computed(() => currentUserRole.value === 'admin');

  function login(userId, role) {
    currentUserId.value = userId;
    currentUserRole.value = role;
    localStorage.setItem('currentUserId', userId);
    localStorage.setItem('currentUserRole', role);
  }

  function logout() {
    currentUserId.value = null;
    currentUserRole.value = null;
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserRole');
    router.push('/account/signin'); // 登出後導向登入頁面
  }

  return {
    currentUserId,
    currentUserRole,
    isLoggedIn,
    isAdmin,
    login,
    logout,
  };
}
