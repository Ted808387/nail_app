<template>
  <div class="min-h-screen bg-soft-blue-50 p-8">
    <h1 class="text-4xl font-bold text-soft-blue-800 text-center mb-10">營業設定</h1>

    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-soft-blue-200">
      <form @submit.prevent="saveSettings">
        <h2 class="text-3xl font-semibold text-soft-blue-700 mb-6">營業時間</h2>
        <div v-for="day in businessHours" :key="day.id" class="flex items-center mb-4">
          <label class="w-24 text-soft-blue-700 font-medium">{{ day.name }}</label>
          <input type="time" v-model="day.open"
            class="shadow appearance-none border border-soft-blue-300 rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400 mr-2">
          <span class="text-soft-blue-700">-</span>
          <input type="time" v-model="day.close"
            class="shadow appearance-none border border-soft-blue-300 rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400 mx-2">
          <label class="flex items-center text-soft-blue-700">
            <input type="checkbox" v-model="day.isClosed" class="form-checkbox h-5 w-5 text-soft-blue-600 rounded-md mr-1">
            休息
          </label>
        </div>

        <h2 class="text-3xl font-semibold text-soft-blue-700 mt-10 mb-6">特別公休日</h2>
        <div class="mb-4">
          <label for="holiday-date" class="block text-soft-blue-700 text-sm font-bold mb-2">新增公休日</label>
          <input type="date" id="holiday-date" v-model="newHolidayDate"
            class="shadow appearance-none border border-soft-blue-300 rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400 mr-2">
          <button type="button" @click="addHoliday"
            class="px-6 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">
            新增
          </button>
        </div>
        <ul class="list-disc list-inside text-soft-blue-700">
          <li v-for="(holiday, index) in holidays" :key="index" class="mb-1">
            {{ holiday }}
            <button type="button" @click="removeHoliday(index)" class="ml-2 text-red-500 hover:text-red-700 text-sm">
              移除
            </button>
          </li>
        </ul>

        <button type="submit"
          class="mt-10 px-8 py-3 bg-soft-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">
          儲存設定
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

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

function addHoliday() {
  if (newHolidayDate.value && !holidays.value.includes(newHolidayDate.value)) {
    holidays.value.push(newHolidayDate.value);
    newHolidayDate.value = '';
  }
}

function removeHoliday(index) {
  holidays.value.splice(index, 1);
}

function saveSettings() {
  console.log('儲存營業設定:', { businessHours: businessHours.value, holidays: holidays.value });
  // 在此處加入呼叫後端 API 的邏輯
}
</script>

<style scoped>
/* 移除舊有 CSS，完全使用 Tailwind */
</style>