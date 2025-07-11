<template>
  <div class="min-h-screen flex items-center justify-center bg-soft-blue-50 p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-soft-blue-200">
      <h1 class="text-3xl font-bold text-soft-blue-800 text-center mb-8">建立您的帳號</h1>
      <form @submit.prevent="handleSignUp">
        <div class="mb-5">
          <label for="name" class="block text-soft-blue-700 text-sm font-bold mb-2">姓名</label>
          <input type="text" id="name" v-model="name" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
        </div>
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
        <div class="mb-6">
          <label for="admin-code" class="block text-soft-blue-700 text-sm font-bold mb-2">管理員驗證碼 (選填)</label>
          <input type="text" id="admin-code" v-model="adminCode" placeholder="請輸入 BEAUTY2025"
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          <p v-if="isAdmin" class="text-soft-blue-600 text-xs italic mt-2">您將註冊為管理員帳號。</p>
        </div>
        <button type="submit"
          class="w-full bg-soft-blue-600 hover:bg-soft-blue-700 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300">
          註冊
        </button>
      </form>
      <p class="text-center text-soft-blue-600 text-sm mt-6">
        已經有帳號了？
        <router-link to="/account/signin" class="text-soft-blue-700 hover:text-soft-blue-900 font-bold">點此登入</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const name = ref('');
const email = ref('');
const password = ref('');
const adminCode = ref('');

const isAdmin = computed(() => adminCode.value === 'BEAUTY2025');

function handleSignUp() {
  if (isAdmin.value) {
    console.log('註冊為管理員:', { name: name.value, email: email.value });
    // 在此處加入呼叫後端 API 註冊管理員的邏輯
  } else {
    console.log('註冊為客戶:', { name: name.value, email: email.value });
    // 在此處加入呼叫後端 API 註冊客戶的邏輯
  }
  // 註冊成功後導向到對應頁面
}
</script>

<style scoped>
/* 移除舊有 CSS，完全使用 Tailwind */
</style>