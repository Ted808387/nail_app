<template>
  <div class="min-h-screen flex items-center justify-center bg-soft-blue-50 p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center border border-soft-blue-200">
      <h1 class="text-3xl font-bold text-soft-blue-800 mb-6">首次管理員設定</h1>
      <p class="text-soft-blue-600 mb-8">歡迎使用！這是系統的第一次啟動，請設定您的管理員帳號。</p>
      <form @submit.prevent="setupAdmin">
        <div class="mb-5">
          <label for="name" class="block text-soft-blue-700 text-sm font-bold mb-2 text-left">姓名</label>
          <input type="text" id="name" v-model="name" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
        </div>
        <div class="mb-5">
          <label for="email" class="block text-soft-blue-700 text-sm font-bold mb-2 text-left">Email</label>
          <input type="email" id="email" v-model="email" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
        </div>
        <div class="mb-6">
          <label for="password" class="block text-soft-blue-700 text-sm font-bold mb-2 text-left">密碼</label>
          <input type="password" id="password" v-model="password" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
        </div>
        <button type="submit"
          class="w-full bg-soft-blue-600 hover:bg-soft-blue-700 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300">
          完成設定並登入
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();

function setupAdmin() {
  console.log('執行首次管理員設定:', { name: name.value, email: email.value });
  // 在此處加入呼叫後端 API 的邏輯
  // 設定完成後，自動登入並導向到管理員儀表板
  router.push('/admin');
}
</script>

<style scoped>
/* 移除舊有 CSS，完全使用 Tailwind */
</style>