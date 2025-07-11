<template>
  <div class="min-h-screen bg-soft-blue-50 p-8">
    <h1 class="text-4xl font-bold text-soft-blue-800 text-center mb-10">預約管理行事曆</h1>

    <div class="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-soft-blue-200">
      <div class="flex justify-between items-center mb-8">
        <div class="flex space-x-4">
          <button class="px-6 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">上個月</button>
          <span class="text-2xl font-semibold text-soft-blue-800">2025 年 7 月</span>
          <button class="px-6 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">下個月</button>
        </div>
        <button @click="isModalOpen = true"
          class="px-6 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">
          手動新增預約
        </button>
      </div>

      <div class="bg-soft-blue-100 p-10 rounded-xl min-h-[500px] flex items-center justify-center text-soft-blue-600 text-xl border border-soft-blue-200">
        <!-- 這裡應該放一個功能完整的日曆元件 -->
        <p>(功能完整的日曆元件 placeholder)</p>
        <p class="absolute bottom-4 text-sm text-soft-blue-500">您可以在此查看、點擊、修改預約，或設定某時段不開放。</p>
      </div>

      <!-- 新增/修改預約的 Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative border border-soft-blue-200">
          <button @click="isModalOpen = false" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold">&times;</button>
          <h2 class="text-3xl font-bold text-soft-blue-800 mb-6">{{ currentBooking.id ? '編輯' : '新增' }}預約</h2>
          <!-- 表單內容 -->
          <form>
            <div class="mb-4">
              <label for="client" class="block text-soft-blue-700 text-sm font-bold mb-2">客戶</label>
              <input type="text" id="client" class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
            </div>
            <div class="mb-4">
              <label for="service" class="block text-soft-blue-700 text-sm font-bold mb-2">服務</label>
              <input type="text" id="service" class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
            </div>
            <div class="mb-6">
              <label for="time" class="block text-soft-blue-700 text-sm font-bold mb-2">時間</label>
              <input type="datetime-local" id="time" class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
            </div>
            <button type="submit" class="w-full bg-soft-blue-600 hover:bg-soft-blue-700 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300">儲存預約</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isModalOpen = ref(false);
const currentBooking = ref({}); // 用於編輯時儲存當前預約資料

// 這裡需要整合一個功能完整的日曆庫 (例如 FullCalendar) 並載入預約資料
</script>

<style scoped>
/* 移除舊有 CSS，完全使用 Tailwind */
</style>