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

        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mt-8 sm:mt-10 mb-5 sm:mb-6">不可預約日期</h2>
        <div class="mb-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <label for="unavailable-date" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2 sm:mb-0">新增不可預約日期</label>
          <input type="date" id="unavailable-date" v-model="newUnavailableDate"
            class="shadow appearance-none border border-soft-blue-300 rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400 w-full sm:w-auto text-sm sm:text-base">
          <button type="button" @click="addUnavailableDate" :disabled="isLoading"
            class="px-5 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 text-sm sm:text-base w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? '新增中...' : '新增' }}
          </button>
        </div>
        <ul class="list-disc list-inside text-soft-blue-700 text-base sm:text-lg">
          <li v-for="(date, index) in unavailableDates" :key="index" class="mb-1">
            {{ date }}
            <button type="button" @click="removeUnavailableDate(index)" :disabled="isLoading"
              class="ml-2 text-red-500 hover:text-red-700 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLoading ? '移除中...' : '移除' }}
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
          <button type="button" @click="addTimeSlot" :disabled="isLoading"
            class="px-5 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 text-sm sm:text-base w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? '新增中...' : '新增' }}
          </button>
        </div>
        <ul class="list-disc list-inside text-soft-blue-700 text-base sm:text-lg">
          <li v-for="(slot, index) in bookableTimeSlots" :key="index" class="mb-1">
            {{ slot.start }} - {{ slot.end }}
            <button type="button" @click="removeTimeSlot(index)" :disabled="isLoading"
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
import { ref, onMounted } from 'vue';
import { useNotification } from '../../composables/useNotification';
import { fetchBusinessSettings, saveBusinessSettings as saveBusinessSettingsApi } from '../../api'; // 引入所有需要的 API 函數

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
const holidays = ref([]); // 從 API 載入

const newUnavailableDate = ref('');
const unavailableDates = ref([]); // 從 API 載入

const newSlotStartTime = ref('');
const newSlotEndTime = ref('');
const bookableTimeSlots = ref([]); // 從 API 載入

const isLoading = ref(false); // 新增載入狀態
const { showSuccess, showError, showInfo } = useNotification(); // 使用通知組合式函數

// 在組件掛載時載入設定
onMounted(async () => {
  isLoading.value = true;
  try {
    const settings = await fetchBusinessSettings();
    // 確保從後端載入的數據結構與前端期望的匹配
    businessHours.value = settings.business_hours.map(day => ({
      id: day.id,
      name: day.name, // 假設後端返回的 business_hours 包含 name 屬性
      open: day.open_time,
      close: day.close_time,
      isClosed: day.is_closed // 假設後端返回的 business_hours 包含 is_closed 屬性
    }));
    holidays.value = settings.holidays.map(h => h.date); // 假設後端返回的 holidays 是物件陣列
    unavailableDates.value = settings.unavailable_dates.map(ud => ud.date) || [];
    bookableTimeSlots.value = settings.bookable_time_slots.map(slot => ({
      id: slot.id,
      start: slot.start_time,
      end: slot.end_time
    })) || [];
  } catch (error) {
    console.error('載入營業設定失敗:', error);
    showError('載入營業設定失敗，請稍後再試。');
  } finally {
    isLoading.value = false;
  }
});

async function addHoliday() {
  if (!newHolidayDate.value) {
    showError('請選擇要新增的公休日日期。');
    return;
  }
  // 檢查是否已存在
  if (holidays.value.some(h => h === newHolidayDate.value)) {
    showInfo('該日期已存在於公休日列表中。');
    return;
  }
  holidays.value.push(newHolidayDate.value);
  newHolidayDate.value = '';
  showSuccess('公休日已新增到暫存列表！請點擊儲存設定以保存。');
}

function removeHoliday(index) {
  if (confirm('您確定要移除此公休日嗎？')) {
    holidays.value.splice(index, 1);
    showSuccess('公休日已從暫存列表移除！請點擊儲存設定以保存。');
  }
}

async function addUnavailableDate() {
  if (!newUnavailableDate.value) {
    showError('請選擇要新增的不可預約日期。');
    return;
  }
  // 檢查是否已存在
  if (unavailableDates.value.some(ud => ud === newUnavailableDate.value)) {
    showInfo('該日期已存在於不可預約列表中。');
    return;
  }
  unavailableDates.value.push(newUnavailableDate.value);
  newUnavailableDate.value = '';
  showSuccess('不可預約日期已新增到暫存列表！請點擊儲存設定以保存。');
}

function removeUnavailableDate(index) {
  if (confirm('您確定要移除此不可預約日期嗎？')) {
    unavailableDates.value.splice(index, 1);
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
  const newSlot = { start: newSlotStartTime.value, end: newSlotEndTime.value };
  if (bookableTimeSlots.value.some(slot => slot.start === newSlot.start && slot.end === newSlot.end)) {
    showInfo('該時間段已存在。');
    return;
  }

  bookableTimeSlots.value.push(newSlot);
  // 排序時間段
  bookableTimeSlots.value.sort((a, b) => a.start.localeCompare(b.start));
  newSlotStartTime.value = '';
  newSlotEndTime.value = '';
  showSuccess('時間段已新增到暫存列表！請點擊儲存設定以保存。');
}

function removeTimeSlot(index) {
  if (confirm('您確定要移除此時間段嗎？')) {
    bookableTimeSlots.value.splice(index, 1);
    showSuccess('時間段已從暫存列表移除！請點擊儲存設定以保存。');
  }
}

async function saveSettings() {
  isLoading.value = true; // 開始載入
  try {
    const settingsToSave = {
      business_hours: businessHours.value.map(day => ({
        day_of_week: day.id, // 假設 id 就是 day_of_week
        open_time: day.open,
        close_time: day.close,
        is_closed: day.isClosed
      })),
      holidays: holidays.value.map(h => ({ date: h, description: null })),
      unavailable_dates: unavailableDates.value.map(ud => ({ date: ud, reason: null })),
      bookable_time_slots: bookableTimeSlots.value.map(slot => ({
        start_time: slot.start,
        end_time: slot.end
      }))
    };
    await saveBusinessSettingsApi(settingsToSave); // 調用 API
    showSuccess('營業設定已成功儲存！');
    // 重新載入數據以確保最新狀態
    await fetchBusinessSettings();
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
