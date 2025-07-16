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
      <div v-for="day in calendarDays" :key="day.date || day.key"
        :class="[
          'p-2 rounded-md text-sm h-20 flex flex-col justify-between',
          day.isCurrentMonth ? 'bg-white text-soft-blue-800' : 'bg-gray-100 text-gray-500',
          day.isSelectable ? 'cursor-pointer hover:bg-soft-blue-50' : 'opacity-50 cursor-not-allowed',
          day.isToday ? 'border-2 border-soft-blue-600 ring-2 ring-soft-blue-600' : '',
          day.date === selectedDate ? 'bg-soft-blue-200 border-2 border-soft-blue-600' : ''
        ]"
        @click="selectDate(day)">
        <p class="font-bold">{{ day.dayOfMonth }}</p>
        <div v-if="day.isCurrentMonth && day.isBooked" class="text-xs text-red-600 font-medium">
          已預約
        </div>
        <div v-else-if="day.isCurrentMonth && !day.isSelectable" class="text-xs text-gray-500 font-medium">
          不可預約
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  selectedDate: String, // 從父組件傳入的選定日期
  holidays: Array,
  unavailableDates: Array,
  businessHours: Array,
  bookings: Array,
  bookableTimeSlots: Array,
  bookingDuration: {
    type: Number,
    default: 30 // 預設為 30 分鐘
  }
});

const emit = defineEmits(['update:selectedDate']);

const currentMonth = ref(new Date()); // 當前顯示的月份

// 輔助函數：將 Date 物件格式化為 YYYY-MM-DD 字串
function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 計算當前顯示的月份和年份
const currentMonthYear = computed(() => {
  return currentMonth.value.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });
});

// 生成日曆天數
const calendarDays = computed(() => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // 填充上個月的空白
  const startDay = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday...
  for (let i = 0; i < startDay; i++) {
    days.push({ date: '', dayOfMonth: '', isCurrentMonth: false, isSelectable: false, isToday: false, isBooked: false, key: `prev-${i}` });
  }

  // 填充本月天數
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const date = new Date(year, month, i);
    const dateString = formatDateToYYYYMMDD(date);

    const isHoliday = props.holidays.includes(dateString);
    const isUnavailable = props.unavailableDates.includes(dateString);
    
    const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const businessDay = props.businessHours.find(d => d.id === (dayOfWeek === 0 ? 7 : dayOfWeek));
    const isClosedDay = businessDay ? businessDay.isClosed : true; // 如果沒有設定，預設為關閉

    const isPastDate = date < today;

    // 檢查當天是否有預約，並判斷是否所有可預約時段都已滿
    const dayBookings = props.bookings.filter(b => b.date === dateString);

    // 輔助函數：將 HH:MM 轉換為分鐘數
    const timeToMinutes = (timeString) => {
      const [h, m] = timeString.split(':').map(Number);
      return h * 60 + m;
    };

    // 輔助函數：將分鐘數轉換為 HH:MM
    const minutesToTime = (totalMinutes) => {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    // 獲取當天所有實際可預約的 30 分鐘時段
    let allPossibleBookableSlots = [];
    if (businessDay && !businessDay.isClosed) {
      const startHour = parseInt(businessDay.open.split(':')[0]);
      const startMinute = parseInt(businessDay.open.split(':')[1]);
      const endHour = parseInt(businessDay.close.split(':')[0]);
      const endMinute = parseInt(businessDay.close.split(':')[1]);

      let currentTime = new Date();
      currentTime.setHours(startHour, startMinute, 0, 0);

      const endTime = new Date();
      endTime.setHours(endHour, endMinute, 0, 0);

      while (currentTime < endTime) {
        const hour = currentTime.getHours().toString().padStart(2, '0');
        const minute = currentTime.getMinutes().toString().padStart(2, '0');
        const timeString = `${hour}:${minute}`;

        const isInBookableSlotRange = props.bookableTimeSlots.some(slot => {
          const slotStartMinutes = timeToMinutes(slot.start);
          const slotEndMinutes = timeToMinutes(slot.end);
          const currentMinutes = timeToMinutes(timeString);
          return currentMinutes >= slotStartMinutes && currentMinutes < slotEndMinutes;
        });

        if (props.bookableTimeSlots.length === 0 || isInBookableSlotRange) {
          allPossibleBookableSlots.push(timeString);
        }

        currentTime.setMinutes(currentTime.getMinutes() + 30); // 每隔30分鐘一個時段
      }
    }

    // 獲取當天所有被預約的 30 分鐘時段
    const occupiedSlots = new Set();
    dayBookings.forEach(booking => {
      const bookingStartMinutes = timeToMinutes(booking.time);
      // Fallback for older bookings without totalDuration, assume 30 minutes
      const duration = booking.totalDuration && typeof booking.totalDuration === 'number' ? booking.totalDuration : 30;
      const bookingEndMinutes = bookingStartMinutes + duration;

      for (let m = bookingStartMinutes; m < bookingEndMinutes; m += 30) {
        occupiedSlots.add(minutesToTime(m));
      }
    });

    // 檢查是否有足夠的連續時段來滿足預約時長
    const hasSufficientSlot = () => {
      if (props.bookingDuration <= 0) return true; // 如果不需要時長，則永遠有空位
      if (allPossibleBookableSlots.length === 0) return false;

      const requiredSlots = Math.ceil(props.bookingDuration / 30);

      for (let i = 0; i <= allPossibleBookableSlots.length - requiredSlots; i++) {
        let isConsecutive = true;
        for (let j = 0; j < requiredSlots; j++) {
          const slotToCheck = allPossibleBookableSlots[i + j];
          if (occupiedSlots.has(slotToCheck)) {
            isConsecutive = false;
            break;
          }
        }
        if (isConsecutive) {
          // 檢查時段是否真的連續（處理非 30 分鐘間隔的情況）
          const firstSlotMinutes = timeToMinutes(allPossibleBookableSlots[i]);
          const lastSlotMinutes = timeToMinutes(allPossibleBookableSlots[i + requiredSlots - 1]);
          if ((lastSlotMinutes - firstSlotMinutes) === (requiredSlots - 1) * 30) {
            return true; // 找到足夠的連續空閒時段
          }
        }
      }
      return false; // 未找到足夠的連續空閒時段
    };

    const isBooked = !hasSufficientSlot();

    // 可選條件：不是過去日期，不是公休日，不是不可預約日期，不是休息日，且當天有可預約時段
    const isSelectable = !isPastDate && !isHoliday && !isUnavailable && !isClosedDay && hasSufficientSlot();

    days.push({
      date: dateString,
      dayOfMonth: i,
      isCurrentMonth: true,
      isSelectable: isSelectable,
      isToday: date.getTime() === today.getTime(),
      isBooked: isBooked,
      key: dateString
    });
  }

  console.log('days', days)

  return days;
});

// 導航月份
function navigateMonth(direction) {
  if (direction === 'prev') {
    currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1);
  } else {
    currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1);
  }
}

// 選擇日期
function selectDate(day) {
  console.log('Selected day:', day);
  if (day.isSelectable) {
    emit('update:selectedDate', day.date);
  }
}

// 監聽父組件傳入的 selectedDate 變化，同步更新 currentMonth
watch(() => props.selectedDate, (newDate) => {
  if (newDate) {
    currentMonth.value = new Date(newDate);
  }
}, { immediate: true });
</script>

<style scoped>
/* 可以添加一些 CustomerCalendar 特有的樣式 */
</style>
