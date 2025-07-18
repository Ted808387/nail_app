<template>
  <div class="min-h-screen bg-soft-blue-50 p-4 sm:p-6 md:p-8">
    <h1 class="text-3xl sm:text-4xl font-bold text-soft-blue-800 text-center mb-8 sm:mb-10">營業設定</h1>

    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-soft-blue-200">
      <form @submit.prevent="saveSettings">
        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mb-5 sm:mb-6">營業時間</h2>
        <div v-for="day in businessSettingsStore.settings?.business_hours" :key="day.id" class="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-3">
          <label class="w-full sm:w-24 text-soft-blue-700 font-medium mb-2 sm:mb-0">{{ day.name }}</label>
          <div class="flex items-center w-full sm:w-auto">
            <input type="time" v-model="day.open_time"
              class="shadow appearance-none border border-soft-blue-300 rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400 mr-2 text-sm sm:text-base">
            <span class="text-soft-blue-700 text-sm sm:text-base">-</span>
            <input type="time" v-model="day.close_time"
              class="shadow appearance-none border border-soft-blue-300 rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400 mx-2 text-sm sm:text-base">
            <label class="flex items-center text-soft-blue-700 text-sm sm:text-base">
              <input type="checkbox" v-model="day.is_closed" class="form-checkbox h-4 w-4 text-soft-blue-600 rounded-md mr-1">
              休息
            </label>
          </div>
        </div>

        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mt-8 sm:mt-10 mb-5 sm:mb-6">特別公休日</h2>
        <div class="mb-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <label for="holiday-date" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2 sm:mb-0">新增公休日</label>
          <input type="date" id="holiday-date" v-model="newHolidayDate"
            class="shadow appearance-none border border-soft-blue-300 rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400 w-full sm:w-auto text-sm sm:text-base">
          <button type="button" @click="addHoliday" :disabled="businessSettingsStore.isLoading"
            class="px-5 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 text-sm sm:text-base w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
            {{ businessSettingsStore.isLoading ? '新增中...' : '新增' }}
          </button>
        </div>
        <ul class="list-disc list-inside text-soft-blue-700 text-base sm:text-lg">
          <li v-for="(holiday, index) in businessSettingsStore.settings?.holidays" :key="index" class="mb-1">
            {{ holiday.date }}
            <button type="button" @click="removeHoliday(index)" :disabled="businessSettingsStore.isLoading"
              class="ml-2 text-red-500 hover:text-red-700 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {{ businessSettingsStore.isLoading ? '移除中...' : '移除' }}
            </button>
          </li>
        </ul>

        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mt-8 sm:mt-10 mb-5 sm:mb-6">不可預約日期</h2>
        <div class="mb-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <label for="unavailable-date" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2 sm:mb-0">新增不可預約日期</label>
          <input type="date" id="unavailable-date" v-model="newUnavailableDate"
            class="shadow appearance-none border border-soft-blue-300 rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400 w-full sm:w-auto text-sm sm:text-base">
          <button type="button" @click="addUnavailableDate" :disabled="businessSettingsStore.isLoading"
            class="px-5 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 text-sm sm:text-base w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
            {{ businessSettingsStore.isLoading ? '新增中...' : '新增' }}
          </button>
        </div>
        <ul class="list-disc list-inside text-soft-blue-700 text-base sm:text-lg">
          <li v-for="(date, index) in businessSettingsStore.settings?.unavailable_dates" :key="index" class="mb-1">
            {{ date.date }}
            <button type="button" @click="removeUnavailableDate(index)" :disabled="businessSettingsStore.isLoading"
              class="ml-2 text-red-500 hover:text-red-700 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {{ businessSettingsStore.isLoading ? '移除中...' : '移除' }}
            </button>
          </li>
        </ul>

        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mt-8 sm:mt-10 mb-5 sm:mb-6">可預約時間段落</h2>
        <div class="mb-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <label for="slot-start-time" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2 sm:mb-0">開始時間</label>
          <input type="time" id="slot-start-time" v-model="newSlotStartTime"
            class="shadow appearance-none border border-soft-blue-300 rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400 w-full sm:w-auto text-sm sm:text-base">
          <label for="slot-end-time" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2 sm:mb-0">結束時間</label>
          <input type="time" id="slot-end-time" v-model="newSlotEndTime"
            class="shadow appearance-none border border-soft-blue-300 rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400 w-full sm:w-auto text-sm sm:text-base">
          <button type="button" @click="addTimeSlot" :disabled="businessSettingsStore.isLoading"
            class="px-5 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 text-sm sm:text-base w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
            {{ businessSettingsStore.isLoading ? '新增中...' : '新增' }}
          </button>
        </div>
        <ul class="list-disc list-inside text-soft-blue-700 text-base sm:text-lg">
          <li v-for="(slot, index) in businessSettingsStore.settings?.bookable_time_slots" :key="index" class="mb-1">
            {{ slot.start_time }} - {{ slot.end_time }}
            <button type="button" @click="removeTimeSlot(index)" :disabled="businessSettingsStore.isLoading"
              class="ml-2 text-red-500 hover:text-red-700 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {{ businessSettingsStore.isLoading ? '移除中...' : '移除' }}
            </button>
          </li>
        </ul>

        <button type="submit" :disabled="businessSettingsStore.isLoading"
          class="mt-8 sm:mt-10 px-6 sm:px-8 py-2 sm:py-3 bg-soft-blue-600 text-white text-base sm:text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed">
          {{ businessSettingsStore.isLoading ? '儲存中...' : '儲存設定' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNotification } from '../../composables/useNotification';
import { useBusinessSettingsStore } from '../../stores/businessSettings';

const businessSettingsStore = useBusinessSettingsStore();
const { showSuccess, showError, showInfo } = useNotification();

const newHolidayDate = ref('');
const newUnavailableDate = ref('');
const newSlotStartTime = ref('');
const newSlotEndTime = ref('');

// 在組件掛載時載入設定
onMounted(async () => {
  try {
    await businessSettingsStore.fetchBusinessSettings();
  } catch (error) {
    console.error('載入營業設定失敗:', error);
    showError(businessSettingsStore.error || '載入營業設定失敗，請稍後再試。');
  }
});

async function addHoliday() {
  if (!newHolidayDate.value) {
    showError('請選擇要新增的公休日日期。');
    return;
  }
  // 檢查是否已存在
  if (businessSettingsStore.settings.holidays.some(h => h.date === newHolidayDate.value)) {
    showInfo('該日期已存在於公休日列表中。');
    return;
  }
  // 直接修改 store 中的數據
  businessSettingsStore.settings.holidays.push({ date: newHolidayDate.value, description: null });
  newHolidayDate.value = '';
  showSuccess('公休日已新增到暫存列表！請點擊儲存設定以保存。');
}

function removeHoliday(index) {
  if (confirm('您確定要移除此公休日嗎？')) {
    businessSettingsStore.settings.holidays.splice(index, 1);
    showSuccess('公休日已從暫存列表移除！請點擊儲存設定以保存。');
  }
}

async function addUnavailableDate() {
  if (!newUnavailableDate.value) {
    showError('請選擇要新增的不可預約日期。');
    return;
  }
  // 檢查是否已存在
  if (businessSettingsStore.settings.unavailable_dates.some(ud => ud.date === newUnavailableDate.value)) {
    showInfo('該日期已存在於不可預約列表中。');
    return;
  }
  // 直接修改 store 中的數據
  businessSettingsStore.settings.unavailable_dates.push({ date: newUnavailableDate.value, reason: null });
  newUnavailableDate.value = '';
  showSuccess('不可預約日期已新增到暫存列表！請點擊儲存設定以保存。');
}

function removeUnavailableDate(index) {
  if (confirm('您確定要移除此不可預約日期嗎？')) {
    businessSettingsStore.settings.unavailable_dates.splice(index, 1);
    showSuccess('不可預約日期已從暫存列表移除！請點擊儲存設定以保存。');
  }
}

async function addTimeSlot() {
  if (!newSlotStartTime.value || !newSlotEndTime.value) {
    showError('請填寫開始時間和結束時間。');
    return;
  }
  if (newSlotStartTime.value >= newSlotEndTime.value) {
    showError('開始時間必須早於結束時間。');
    return;
  }
  const newSlot = { start_time: newSlotStartTime.value, end_time: newSlotEndTime.value };
  if (businessSettingsStore.settings.bookable_time_slots.some(slot => slot.start_time === newSlot.start_time && slot.end_time === newSlot.end_time)) {
    showInfo('該時間段已存在。');
    return;
  }

  // 直接修改 store 中的數據
  businessSettingsStore.settings.bookable_time_slots.push(newSlot);
  // 排序時間段
  businessSettingsStore.settings.bookable_time_slots.sort((a, b) => a.start_time.localeCompare(b.start_time));
  newSlotStartTime.value = '';
  newSlotEndTime.value = '';
  showSuccess('時間段已新增到暫存列表！請點擊儲存設定以保存。');
}

function removeTimeSlot(index) {
  if (confirm('您確定要移除此時間段嗎？')) {
    businessSettingsStore.settings.bookable_time_slots.splice(index, 1);
    showSuccess('時間段已從暫存列表移除！請點擊儲存設定以保存。');
  }
}

async function saveSettings() {
  try {
    const settingsToSave = {
      business_hours: businessSettingsStore.settings.business_hours.map(day => ({
        day_of_week: day.id, // 假設 id 就是 day_of_week
        open_time: day.open_time,
        close_time: day.close_time,
        is_closed: day.is_closed
      })),
      holidays: businessSettingsStore.settings.holidays.map(h => ({
        date: h.date,
        description: h.description || null
      })),
      unavailable_dates: businessSettingsStore.settings.unavailable_dates.map(ud => ({
        date: ud.date,
        reason: ud.reason || null
      })),
      bookable_time_slots: businessSettingsStore.settings.bookable_time_slots.map(slot => ({
        start_time: slot.start_time,
        end_time: slot.end_time
      }))
    };
    await businessSettingsStore.saveBusinessSettings(settingsToSave); // 調用 Pinia Store 的 action
    showSuccess('營業設定已成功儲存！');
  } catch (error) {
    console.error('儲存營業設定失敗:', error);
    showError(businessSettingsStore.error || '儲存營業設定失敗，請稍後再試。');
  }
}
</script>

<style scoped>
/* 移除舊有 CSS，完全使用 Tailwind */
</style>
