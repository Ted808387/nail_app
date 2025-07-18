<template>
  <div class="min-h-screen flex items-center justify-center bg-soft-blue-50 p-4 sm:p-6 md:p-8">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-soft-blue-200">
      <h1 class="text-2xl sm:text-3xl font-bold text-soft-blue-800 text-center mb-6 sm:mb-8">登入</h1>
      <form @submit.prevent="handleSignIn">
        <div class="mb-4 sm:mb-5">
          <label for="email" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2">Email <span class="text-red-500">*</span></label>
          <input type="email" id="email" v-model="email" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          <p v-if="errors.email" class="text-red-500 text-xs italic mt-1">{{ errors.email }}</p>
        </div>
        <div class="mb-5 sm:mb-6">
          <label for="password" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2">密碼 <span class="text-red-500">*</span></label>
          <input type="password" id="password" v-model="password" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          <p v-if="errors.password" class="text-red-500 text-xs italic mt-1">{{ errors.password }}</p>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between mb-5 sm:mb-6">
          <div class="flex items-center mb-3 sm:mb-0">
            <input id="remember-me" type="checkbox" v-model="rememberMe" class="h-4 w-4 text-soft-blue-600 focus:ring-soft-blue-500 border-gray-300 rounded">
            <label for="remember-me" class="ml-2 block text-sm sm:text-base text-soft-blue-700">
              記住我
            </label>
          </div>
          <a href="#" class="text-sm sm:text-base text-soft-blue-600 hover:text-soft-blue-800 hover:underline">忘記密碼？</a>
        </div>

        <p v-if="loginError" class="text-red-500 text-center text-sm mb-3 sm:mb-4">{{ loginError }}</p>

        <button type="submit" :disabled="isLoading"
          class="w-full bg-soft-blue-600 hover:bg-soft-blue-700 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoading ? '登入中...' : '登入' }}
        </button>
      </form>
      <p class="text-center text-soft-blue-600 text-sm sm:text-base mt-5 sm:mt-6">
        還沒有帳號？
        <router-link to="/account/signup" class="text-soft-blue-700 hover:text-soft-blue-900 font-bold">點此註冊</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotification } from '../../composables/useNotification';
import { useAuthStore } from '../../stores/auth'; // 引入 Pinia 的 auth store
import { storeToRefs } from 'pinia'; // 引入 storeToRefs

const email = ref('');
const password = ref('');

onMounted(() => {
  email.value = '';
  password.value = '';
});
const rememberMe = ref(false);
const errors = ref({});
const loginError = ref('');
const isLoading = ref(false);

const router = useRouter();
const { showSuccess, showError } = useNotification();
const authStore = useAuthStore(); // 使用 Pinia 的 auth store
const { isAdmin } = storeToRefs(authStore); // 使用 storeToRefs 保持響應性

function validateForm() {
  errors.value = {};
  loginError.value = '';

  if (!email.value) {
    errors.value.email = 'Email 為必填。';
    showError('Email 為必填。');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = '請輸入有效的 Email 格式。';
    showError('請輸入有效的 Email 格式。');
  }
  if (!password.value) {
    errors.value.password = '密碼為必填。';
    showError('密碼為必填。');
  }

  return Object.keys(errors.value).length === 0;
}

async function handleSignIn() {
  console.trace('handleSignIn 被呼叫');
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  try {
    console.log('嘗試登入:', { email: email.value, password: password.value, rememberMe: rememberMe.value });

    const success = await authStore.login(email.value, password.value); // 使用 authStore 的 login 方法

    if (success) {
      showSuccess('登入成功！');
      // 登入成功後，根據用戶角色進行路由跳轉
      if (isAdmin.value) { // 使用解構後的 isAdmin
        router.push('/admin');
      } else {
        router.push('/my-bookings');
      }
    } else {
      // 登入失敗的錯誤訊息已在 authStore 內部處理
      loginError.value = 'Email 或密碼不正確。'; // 這裡可以保留一個通用的錯誤訊息
    }

  } catch (error) {
    console.error('登入過程中發生錯誤:', error);
    showError(error.detail || '登入失敗，請稍後再試。');
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* 這裡可以放置 SignIn 特有的樣式，但盡量使用 Tailwind CSS */
</style>
