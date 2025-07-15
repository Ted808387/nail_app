<template>
  <div class="min-h-screen bg-soft-blue-50 p-4 sm:p-6 md:p-8">
    <h1 class="text-3xl sm:text-4xl font-bold text-soft-blue-800 text-center mb-8 sm:mb-10">營業設定</h1>

    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-soft-blue-200">
      <form @submit.prevent="saveSettings">
        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mb-5 sm:mb-6">營業時間</h2>
        <div v-for="day in businessHours" :key="day.id" class="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-3">
          <label class="w-full sm:w-24 text-soft-blue-700 font-medium mb-2 sm:mb-0">{{ day.name }}</label>
          <div class="flex items-center w-full sm:w-auto">
            <input type="time" v-model="day.open"
              class="shadow appearance-none border border-soft-blue-300 rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400 mr-2 text-sm sm:text-base">
            <span class="text-soft-blue-700 text-sm sm:text-base">-</span>
            <input type="time" v-model="day.close"
              class="shadow appearance-none border border-soft-blue-300 rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400 mx-2 text-sm sm:text-base">
            <label class="flex items-center text-soft-blue-700 text-sm sm:text-base">
              <input type="checkbox" v-model="day.isClosed" class="form-checkbox h-4 w-4 text-soft-blue-600 rounded-md mr-1">
              休息
            </label>
          </div>
        </div>

        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mt-8 sm:mt-10 mb-5 sm:mb-6">特別公休日</h2>
        <div class="mb-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <label for="holiday-date" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2 sm:mb-0">新增公休日</label>
          <input type="date" id="holiday-date" v-model="newHolidayDate"
            class="shadow appearance-none border border-soft-blue-300 rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400 w-full sm:w-auto text-sm sm:text-base">
          <button type="button" @click="addHoliday" :disabled="isLoading"
            class="px-5 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 text-sm sm:text-base w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? '新增中...' : '新增' }}
          </button>
        </div>
        <ul class="list-disc list-inside text-soft-blue-700 text-base sm:text-lg">
          <li v-for="(holiday, index) in holidays" :key="index" class="mb-1">
            {{ holiday }}
            <button type="button" @click="removeHoliday(index)" :disabled="isLoading"
              class="ml-2 text-red-500 hover:text-red-700 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLoading ? '移除中...' : '移除' }}
            </button>
          </li>
        </ul>

        <button type="submit" :disabled="isLoading"
          class="mt-8 sm:mt-10 px-6 sm:px-8 py-2 sm:py-3 bg-soft-blue-600 text-white text-base sm:text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoading ? '儲存中...' : '儲存設定' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useNotification } from '../../composables/useNotification'; // 引入 useNotification

const businessHours = ref([
  { id: 1, name: '星期一', open: '10:00', close: '19:00', isClosed: false },
  { id: 2, name: '星期二', open: '10:00', close: '19:00', isClosed: false },
  { id: 3, name: '星期三', open: '10:00', close: '19:00', isClosed: false },
  { id: 4, name: '星期四', open: '10:00', close: '19:00', isClosed: false },
  { id: 5, name: '星期五', open: '10:00', close: '19:00', isClosed: false },
  { id: 6, name: '星期六', open: '10:00', close: '19:00', isClosed: false },
  { id: 7, name: '星期日', open: '10:00', close: '19:00', isClosed: true },
]);

const newHolidayDate = ref('');
const holidays = ref([
  '2025-01-01', // 元旦
  '2025-02-08', // 農曆新年
]);

const isLoading = ref(false); // 新增載入狀態
const { showSuccess, showError, showInfo } = useNotification(); // 使用通知組合式函數

async function addHoliday() {
  if (!newHolidayDate.value) {
    showError('請選擇要新增的公休日日期。');
    return;
  }
  if (holidays.value.includes(newHolidayDate.value)) {
    showInfo('該日期已存在於公休日列表中。');
    return;
  }

  isLoading.value = true; // 開始載入
  try {
    await new Promise(resolve => setTimeout(resolve, 500)); // 模擬網路延遲
    holidays.value.push(newHolidayDate.value);
    newHolidayDate.value = '';
    showSuccess('公休日已成功新增！');
  } catch (error) {
    console.error('新增公休日失敗:', error);
    showError('新增公休日失敗，請稍後再試。');
  } finally {
    isLoading.value = false; // 結束載入
  }
}

async function removeHoliday(index) {
  if (confirm('您確定要移除此公休日嗎？')) {
    isLoading.value = true; // 開始載入
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // 模擬網路延遲
      holidays.value.splice(index, 1);
      showSuccess('公休日已成功移除！');
    } catch (error) {
      console.error('移除公休日失敗:', error);
      showError('移除公休日失敗，請稍後再試。');
    } finally {
      isLoading.value = false; // 結束載入
    }
  }
}

async function saveSettings() {
  isLoading.value = true; // 開始載入
  console.log('儲存營業設定:', { businessHours: businessHours.value, holidays: holidays.value });
  try {
    // 在此處加入呼叫後端 API 的邏輯
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬網路延遲
    showSuccess('營業設定已成功儲存！');
  } catch (error) {
    console.error('儲存營業設定失敗:', error);
    showError('儲存營業設定失敗，請稍後再試。');
  } finally {
    isLoading.value = false; // 結束載入
  }
}
</script>

<style scoped>
/* 移除舊有 CSS，完全使用 Tailwind */
</style>
