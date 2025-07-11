<template>
  <div class="min-h-screen bg-soft-blue-50 p-8">
    <h1 class="text-4xl font-bold text-soft-blue-800 text-center mb-10">帳號設定</h1>

    <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-soft-blue-200">
      <form @submit.prevent="updateProfile" class="mb-10 pb-10 border-b border-soft-blue-200">
        <h2 class="text-3xl font-semibold text-soft-blue-700 mb-6">修改基本資料</h2>
        <div class="mb-5">
          <label for="name" class="block text-soft-blue-700 text-sm font-bold mb-2">姓名</label>
          <input type="text" id="name" v-model="profile.name"
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
        </div>
        <div class="mb-6">
          <label for="phone" class="block text-soft-blue-700 text-sm font-bold mb-2">聯絡電話</label>
          <input type="tel" id="phone" v-model="profile.phone"
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
        </div>
        <button type="submit"
          class="px-8 py-3 bg-soft-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">
          儲存變更
        </button>
      </form>

      <form @submit.prevent="changePassword">
        <h2 class="text-3xl font-semibold text-soft-blue-700 mb-6">變更密碼</h2>
        <div class="mb-5">
          <label for="current-password" class="block text-soft-blue-700 text-sm font-bold mb-2">目前密碼</label>
          <input type="password" id="current-password" v-model="password.current"
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
        </div>
        <div class="mb-6">
          <label for="new-password" class="block text-soft-blue-700 text-sm font-bold mb-2">新密碼</label>
          <input type="password" id="new-password" v-model="password.new"
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
        </div>
        <button type="submit"
          class="px-8 py-3 bg-soft-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">
          更新密碼
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 這裡僅為示意，實際應從後端獲取使用者資料
const profile = ref({
  name: '範例使用者',
  phone: '0912345678'
});

const password = ref({
  current: '',
  new: ''
});

function updateProfile() {
  console.log('更新個人資料:', profile.value);
  // 在此處加入呼叫後端 API 的邏輯
}

function changePassword() {
  console.log('變更密碼');
  // 在此處加入呼叫後端 API 的邏輯
}
</script>

<style scoped>
/* 移除舊有 CSS，完全使用 Tailwind */
</style>