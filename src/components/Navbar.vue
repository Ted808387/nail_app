<template>
  <nav class="bg-soft-blue-800 p-4 shadow-lg">
    <div class="container mx-auto flex justify-between items-center">
      <!-- Logo / 品牌名稱 -->
      <router-link to="/" class="text-white text-2xl font-bold">
        您的美麗工作室
      </router-link>

      <!-- 漢堡菜單按鈕 (僅在小螢幕顯示) -->
      <div class="sm:hidden">
        <button @click="isOpen = !isOpen" class="text-white focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 導航連結 (大螢幕一直顯示，小螢幕根據 isOpen 顯示) -->
      <div :class="['w-full sm:w-auto sm:flex sm:items-center sm:space-x-6 mt-4 sm:mt-0 overflow-hidden transition-all duration-300 ease-in-out', isOpen ? 'max-h-screen' : 'max-h-0']">
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 items-center">
          <router-link to="/" class="text-white hover:text-soft-blue-200 transition duration-300" @click="isOpen = false">首頁</router-link>
          <router-link to="/services" class="text-white hover:text-soft-blue-200 transition duration-300" @click="isOpen = false">服務項目</router-link>
          <router-link to="/booking" class="text-white hover:text-soft-blue-200 transition duration-300" @click="isOpen = false">立即預約</router-link>
          
          <!-- 根據登入狀態顯示不同按鈕 -->
          <template v-if="!isLoggedIn">
            <router-link to="/account/signin" class="px-4 py-2 bg-soft-blue-600 text-white rounded-full hover:bg-soft-blue-700 transition duration-300" @click="isOpen = false">登入</router-link>
            <router-link to="/account/signup" class="px-4 py-2 bg-white text-soft-blue-600 rounded-full hover:bg-gray-200 transition duration-300" @click="isOpen = false">註冊</router-link>
          </template>
          <template v-else>
            <router-link v-if="isAdmin" to="/admin" class="text-white hover:text-soft-blue-200 transition duration-300" @click="isOpen = false">管理員儀表板</router-link>
            <router-link to="/my-bookings" class="text-white hover:text-soft-blue-200 transition duration-300" @click="isOpen = false">我的預約</router-link>
            <router-link to="/account/settings" class="text-white hover:text-soft-blue-200 transition duration-300" @click="isOpen = false">帳號設定</router-link>
            <button @click="handleLogout" class="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300">登出</button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth'; // 引入 useAuth

const isOpen = ref(false);
const { isLoggedIn, isAdmin, logout } = useAuth(); // 使用 useAuth

function handleLogout() {
  logout(); // 執行登出操作
  isOpen.value = false; // 關閉菜單
}
</script>

<style scoped>
/* 這裡可以放置 Navbar 特有的樣式，但盡量使用 Tailwind CSS */
</style>