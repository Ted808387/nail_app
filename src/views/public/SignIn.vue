<template>
  <div class="min-h-screen flex items-center justify-center bg-soft-blue-50 p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-soft-blue-200">
      <h1 class="text-3xl font-bold text-soft-blue-800 text-center mb-8">登入</h1>
      <form @submit.prevent="handleSignIn">
        <div class="mb-5">
          <label for="email" class="block text-soft-blue-700 text-sm font-bold mb-2">Email <span class="text-red-500">*</span></label>
          <input type="email" id="email" v-model="email" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          <p v-if="errors.email" class="text-red-500 text-xs italic mt-1">{{ errors.email }}</p>
        </div>
        <div class="mb-6">
          <label for="password" class="block text-soft-blue-700 text-sm font-bold mb-2">密碼 <span class="text-red-500">*</span></label>
          <input type="password" id="password" v-model="password" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          <p v-if="errors.password" class="text-red-500 text-xs italic mt-1">{{ errors.password }}</p>
        </div>

        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <input id="remember-me" type="checkbox" v-model="rememberMe" class="h-4 w-4 text-soft-blue-600 focus:ring-soft-blue-500 border-gray-300 rounded">
            <label for="remember-me" class="ml-2 block text-sm text-soft-blue-700">
              記住我
            </label>
          </div>
          <a href="#" class="text-sm text-soft-blue-600 hover:text-soft-blue-800 hover:underline">忘記密碼？</a>
        </div>

        <p v-if="loginError" class="text-red-500 text-center text-sm mb-4">{{ loginError }}</p>

        <button type="submit"
          class="w-full bg-soft-blue-600 hover:bg-soft-blue-700 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300">
          登入
        </button>
      </form>
      <p class="text-center text-soft-blue-600 text-sm mt-6">
        還沒有帳號？
        <router-link to="/account/signup" class="text-soft-blue-700 hover:text-soft-blue-900 font-bold">點此註冊</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const errors = ref({});
const loginError = ref(''); // 用於顯示登入失敗的通用錯誤訊息

const router = useRouter();

function validateForm() {
  errors.value = {};
  loginError.value = '';

  if (!email.value) {
    errors.value.email = 'Email 為必填。';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = '請輸入有效的 Email 格式。';
  }
  if (!password.value) {
    errors.value.password = '密碼為必填。';
  }

  return Object.keys(errors.value).length === 0;
}

async function handleSignIn() {
  if (!validateForm()) {
    return; // 如果驗證失敗，停止提交
  }

  try {
    // 這裡模擬呼叫後端 API 進行登入驗證
    console.log('嘗試登入:', { email: email.value, password: password.value, rememberMe: rememberMe.value });

    // 模擬 API 響應
    // 實際應用中，這裡會發送 HTTP 請求到後端
    const response = await new Promise(resolve => setTimeout(() => {
      // 模擬成功登入
      if (email.value === 'admin@example.com' && password.value === 'admin123') {
        resolve({ success: true, role: 'admin' });
      } else if (email.value === 'user@example.com' && password.value === 'user123') {
        resolve({ success: true, role: 'customer' });
      } else {
        resolve({ success: false, message: 'Email 或密碼不正確。' });
      }
    }, 1000)); // 模擬網路延遲

    if (response.success) {
      // 登入成功，根據角色導向不同頁面
      if (response.role === 'admin') {
        router.push('/admin'); // 管理員導向後台儀表板
      } else {
        router.push('/my-bookings'); // 客戶導向我的預約紀錄
      }
    } else {
      // 登入失敗，顯示錯誤訊息
      loginError.value = response.message;
    }

  } catch (error) {
    console.error('登入過程中發生錯誤:', error);
    loginError.value = '登入失敗，請稍後再試。'
  }
}
</script>

<style scoped>
/* 這裡可以放置 SignIn 特有的樣式，但盡量使用 Tailwind CSS */
</style>
