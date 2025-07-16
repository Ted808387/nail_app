<template>
  <nav class="bg-soft-blue-800 p-4 shadow-lg relative z-50"> <!-- Added relative and z-index -->
    <div class="container mx-auto flex justify-between items-center">
      <!-- Logo / 品牌名稱 -->
      <router-link to="/" class="text-white text-2xl font-bold">
        XXX工作室
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

      <!-- 導航連結 (大螢幕一直顯示，小螢幕根據 isOpen 顯示為浮動菜單) -->
      <div :class="[
        'absolute top-full right-0 bg-soft-blue-800 rounded-lg shadow-lg p-4 w-48', // Floating menu styles
        'sm:relative sm:bg-transparent sm:shadow-none sm:p-0 sm:w-auto sm:block', // Revert styles for large screens
        'transition-all duration-300 ease-in-out transform', // Animation
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none', // Show/hide animation
        'sm:opacity-100 sm:translate-y-0 sm:pointer-events-auto' // Ensure visible and interactive on large screens
      ]">
        <div class="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6 sm:items-center items-start"> <!-- Changed items-end to items-start -->
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
            <router-link v-if="isAdmin" to="/admin/settings" class="text-white hover:text-soft-blue-200 transition duration-300" @click="isOpen = false">營業設定</router-link>
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
import { useAuth } from '../composables/useAuth';

const isOpen = ref(false);
const { isLoggedIn, isAdmin, logout } = useAuth();

function handleLogout() {
  logout();
  isOpen.value = false;
}
</script>

<style scoped>
/* 這裡可以放置 Navbar 特有的樣式，但盡量使用 Tailwind CSS */
</style>
