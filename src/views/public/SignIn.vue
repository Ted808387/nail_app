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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNotification } from '../../composables/useNotification';
import { loginUser } from '../../api'; // 引入 loginUser
import { useAuth } from '../../composables/useAuth'; // 引入 useAuth

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const errors = ref({});
const loginError = ref('');
const isLoading = ref(false);

const router = useRouter();
const { showSuccess, showError } = useNotification();
const { login } = useAuth(); // 使用 useAuth

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
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  try {
    console.log('嘗試登入:', { email: email.value, password: password.value, rememberMe: rememberMe.value });

    const response = await loginUser(email.value, password.value);

    if (response.user_id) {
      showSuccess('登入成功！');
      login(response.user_id, response.user_role); // 使用 useAuth 的 login 方法

      if (response.user_role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/my-bookings');
      }
    } else {
      // 這裡的錯誤處理可能需要根據實際 API 返回的錯誤格式調整
      loginError.value = 'Email 或密碼不正確。';
      showError('Email 或密碼不正確。');
    }

  } catch (error) {
    console.error('登入過程中發生錯誤:', error);
    showError('登入失敗，請稍後再試。');
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* 這裡可以放置 SignIn 特有的樣式，但盡量使用 Tailwind CSS */
</style>
