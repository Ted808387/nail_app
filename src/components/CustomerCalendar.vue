<template>
  <div class="customer-calendar bg-soft-blue-100 p-4 rounded-xl border border-soft-blue-200">
    <div class="flex justify-between items-center mb-4">
      <button @click="navigateMonth('prev')" class="px-3 py-1 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>
      <span class="text-xl font-semibold text-soft-blue-800">{{ currentMonthYear }}</span>
      <button @click="navigateMonth('next')" class="px-3 py-1 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </button>
    </div>

    <div class="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-soft-blue-700 mb-2">
      <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <div v-for="day in calendarDays" :key="day.key"
        :class="[
          'p-2 rounded-md text-sm h-20 flex flex-col justify-between items-center',
          day.isCurrentMonth ? 'bg-white text-soft-blue-800' : 'bg-gray-100 text-gray-400',
          day.isSelectable ? 'cursor-pointer hover:bg-soft-blue-50' : 'opacity-50 cursor-not-allowed',
          day.isToday ? 'border-2 border-soft-blue-600' : '',
          day.date === selectedDate ? 'bg-soft-blue-200 ring-2 ring-soft-blue-500' : ''
        ]"
        @click="selectDate(day)">
        <p class="font-bold">{{ day.dayOfMonth }}</p>
        <div v-if="day.isCurrentMonth && !day.isSelectable" class="text-xs font-medium"
          :class="{'text-red-600': day.reason === 'booked', 'text-gray-500': day.reason === 'unavailable'}">
          {{ day.reason === 'booked' ? '已約滿' : '不可預約' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  selectedDate: String,
  // 接收一個函數來判斷日期是否可預約
  isDateBookable: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(['update:selectedDate']);

const currentMonth = ref(new Date());

// 輔助函數：將 Date 物件格式化為 YYYY-MM-DD 字串
function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const currentMonthYear = computed(() => {
  return currentMonth.value.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });
});

const calendarDays = computed(() => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDay = firstDayOfMonth.getDay();
  for (let i = 0; i < startDay; i++) {
    days.push({ key: `prev-${i}` });
  }

  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const date = new Date(year, month, i);
    const dateString = formatDateToYYYYMMDD(date);

    // 直接調用從父組件傳入的函數來判斷日期狀態
    const { isBookable, reason } = props.isDateBookable(dateString);

    days.push({
      date: dateString,
      dayOfMonth: i,
      isCurrentMonth: true,
      isSelectable: isBookable,
      isToday: date.getTime() === today.getTime(),
      reason: reason, // 'booked' or 'unavailable'
      key: dateString,
    });
  }

  return days;
});

function navigateMonth(direction) {
  const newMonth = new Date(currentMonth.value);
  if (direction === 'prev') {
    newMonth.setMonth(newMonth.getMonth() - 1);
  } else {
    newMonth.setMonth(newMonth.getMonth() + 1);
  }
  currentMonth.value = newMonth;
}

function selectDate(day) {
  if (day.isSelectable) {
    emit('update:selectedDate', day.date);
  }
}

watch(() => props.selectedDate, (newDate) => {
  if (newDate) {
    const newDateObj = new Date(newDate);
    // 確保月份正確，避免跨年問題
    if (newDateObj.getFullYear() !== currentMonth.value.getFullYear() || newDateObj.getMonth() !== currentMonth.value.getMonth()) {
        currentMonth.value = new Date(newDateObj.getFullYear(), newDateObj.getMonth(), 1);
    }
  }
}, { immediate: true });

</script>

<style scoped>
/* 可以添加一些 CustomerCalendar 特有的樣式 */
</style>
