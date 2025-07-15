<template>
  <div class="min-h-screen flex items-center justify-center bg-soft-blue-50 p-4 sm:p-6 md:p-8">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 text-center border border-soft-blue-200">
      <h1 class="text-2xl sm:text-3xl font-bold text-soft-blue-800 mb-4 sm:mb-6">首次管理員設定</h1>
      <p class="text-soft-blue-600 text-sm sm:text-base mb-6 sm:mb-8">歡迎使用！這是系統的第一次啟動，請設定您的管理員帳號。</p>
      <form @submit.prevent="setupAdmin">
        <div class="mb-4 sm:mb-5">
          <label for="name" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2 text-left">姓名</label>
          <input type="text" id="name" v-model="name" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
        </div>
        <div class="mb-4 sm:mb-5">
          <label for="email" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2 text-left">Email</label>
          <input type="email" id="email" v-model="email" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
        </div>
        <div class="mb-5 sm:mb-6">
          <label for="password" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2 text-left">密碼</label>
          <input type="password" id="password" v-model="password" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 mb-2 sm:mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
        </div>
        <button type="submit" :disabled="isLoading"
          class="w-full bg-soft-blue-600 hover:bg-soft-blue-700 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoading ? '設定中...' : '完成設定並登入' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNotification } from '../../composables/useNotification'; // 引入 useNotification

const name = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();
const isLoading = ref(false); // 新增載入狀態
const { showSuccess, showError } = useNotification(); // 使用通知組合式函數

async function setupAdmin() {
  isLoading.value = true; // 開始載入
  console.log('執行首次管理員設定:', { name: name.value, email: email.value });
  try {
    // 在此處加入呼叫後端 API 的邏輯
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬網路延遲
    showSuccess('管理員帳號設定成功！');
    // 設定完成後，自動登入並導向到管理員儀表板
    router.push('/admin');
  } catch (error) {
    console.error('管理員帳號設定失敗:', error);
    showError('管理員帳號設定失敗，請稍後再試。');
  } finally {
    isLoading.value = false; // 結束載入
  }
}
</script>

<style scoped>
/* 移除舊有 CSS，完全使用 Tailwind */
</style>