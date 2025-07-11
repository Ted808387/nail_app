<template>
  <div class="min-h-screen flex items-center justify-center bg-soft-blue-50 p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-soft-blue-200">
      <h1 class="text-3xl font-bold text-soft-blue-800 text-center mb-8">登入</h1>
      <form @submit.prevent="handleSignIn">
        <div class="mb-5">
          <label for="email" class="block text-soft-blue-700 text-sm font-bold mb-2">Email</label>
          <input type="email" id="email" v-model="email" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
        </div>
        <div class="mb-6">
          <label for="password" class="block text-soft-blue-700 text-sm font-bold mb-2">密碼</label>
          <input type="password" id="password" v-model="password" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
        </div>
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
const router = useRouter();

function handleSignIn() {
  console.log('登入資訊:', { email: email.value, password: password.value });
  // 在此處加入呼叫後端 API 進行登入驗證的邏輯
  // 假設登入成功後，需要判斷使用者角色
  const userRole = 'admin'; // or 'customer', 這裡先寫死

  if (userRole === 'admin') {
    router.push('/admin');
  } else {
    router.push('/my-bookings');
  }
}
</script>

<style scoped>
/* 移除舊有 CSS，完全使用 Tailwind */
</style>