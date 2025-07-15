<template>
  <div class="min-h-screen bg-soft-blue-50 p-8">
    <h1 class="text-4xl font-bold text-soft-blue-800 text-center mb-10">預約管理行事曆</h1>

    <div class="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-soft-blue-200">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <!-- 日曆導航與視圖切換 -->
        <div class="flex space-x-2">
          <button @click="changeView('day')" :class="['px-4 py-2 rounded-full text-sm font-semibold transition duration-300', currentView === 'day' ? 'bg-soft-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">日</button>
          <button @click="changeView('week')" :class="['px-4 py-2 rounded-full text-sm font-semibold transition duration-300', currentView === 'week' ? 'bg-soft-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">週</button>
          <button @click="changeView('month')" :class="['px-4 py-2 rounded-full text-sm font-semibold transition duration-300', currentView === 'month' ? 'bg-soft-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">月</button>
        </div>

        <div class="flex items-center space-x-4">
          <button @click="navigateCalendar('prev')" class="px-4 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <span class="text-2xl font-semibold text-soft-blue-800">{{ currentPeriod }}</span>
          <button @click="navigateCalendar('next')" class="px-4 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>

        <button @click="openBookingModal()"
          class="px-6 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">
          手動新增預約
        </button>
      </div>

      <!-- 日曆主體 -->
      <div class="bg-soft-blue-100 p-6 rounded-xl min-h-[500px] border border-soft-blue-200 relative">
        <p class="text-soft-blue-600 text-xl text-center mb-4">
          {{ currentView === 'month' ? '月視圖' : currentView === 'week' ? '週視圖' : '日視圖' }}
        </p>
        <!-- 星期標頭 -->
        <div :class="['grid gap-2 text-center font-semibold text-soft-blue-700 mb-4', currentView === 'day' ? 'hidden' : 'grid-cols-7']">
          <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
        </div>
        <!-- 日期網格 -->
        <div :class="['grid gap-2', currentView === 'day' ? 'grid-cols-1 h-full' : 'grid-cols-7']">
          <div v-for="day in calendarDays" :key="day.date"
            :class="['p-2 border rounded-md text-sm',
              day.isCurrentMonth ? 'bg-white text-soft-blue-800' : 'bg-gray-100 text-gray-500',
              day.isCurrentMonth && !day.isBlocked ? 'cursor-pointer hover:bg-soft-blue-50' : '',
              day.isToday ? 'border-soft-blue-600 ring-2 ring-soft-blue-600' : '',
              currentView === 'day' ? 'col-span-full h-full text-base p-4 flex flex-col' : '',
              currentView === 'week' ? 'min-h-32 flex flex-col' : '' // Apply specific styles for week view
            ]"
            @click="day.isCurrentMonth && !day.isBlocked && openBookingModal({ date: day.date })">
            <p :class="['font-bold mb-1', currentView === 'day' ? 'text-2xl' : '']">{{ day.dayOfMonth }}</p>
            <div v-if="currentView === 'day'" class="text-soft-blue-600 text-lg mb-4">
              {{ new Date(day.date).toLocaleDateString('zh-TW', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) }}
            </div>
            <div :class="['flex-grow', currentView === 'day' ? 'space-y-2' : '', currentView === 'week' ? 'space-y-1 overflow-y-auto max-h-24' : '']">
              <div v-for="booking in day.bookings" :key="booking.id"
                :class="['text-xs p-1 rounded-sm mb-1 cursor-pointer', getBookingStatusClass(booking.status), currentView === 'day' ? 'text-sm p-2' : '']"
                @click.stop="openBookingModal(booking)">
                {{ booking.time }} - {{ booking.clientName }} ({{ booking.serviceName }})
              </div>
              <div v-if="day.isBlocked" :class="['text-xs p-1 rounded-sm bg-red-200 text-red-800', currentView === 'day' ? 'text-sm p-2' : '']">
                不開放預約
              </div>
              <div v-if="currentView === 'day' && day.bookings.length === 0 && !day.isBlocked" class="text-soft-blue-500 text-center py-4">
                本日無預約
              </div>
            </div>
          </div>
        </div>
        <p class="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-soft-blue-500">
          點擊預約可查看詳情或修改。
        </p>
      </div>

      <!-- 新增/修改預約的 Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative border border-soft-blue-200">
          <button @click="closeBookingModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold">&times;</button>
          <h2 class="text-3xl font-bold text-soft-blue-800 mb-6">{{ editingBooking.id ? '編輯' : '新增' }}預約</h2>
          <form @submit.prevent="saveBooking">
            <div class="mb-4">
              <label for="clientName" class="block text-soft-blue-700 text-sm font-bold mb-2">客戶姓名 <span class="text-red-500">*</span></label>
              <input type="text" id="clientName" v-model="editingBooking.clientName" required
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
            </div>
            <div class="mb-4">
              <label for="serviceName" class="block text-soft-blue-700 text-sm font-bold mb-2">服務項目 <span class="text-red-500">*</span></label>
              <input type="text" id="serviceName" v-model="editingBooking.serviceName" required
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
            </div>
            <div class="mb-4">
              <label for="bookingDate" class="block text-soft-blue-700 text-sm font-bold mb-2">日期 <span class="text-red-500">*</span></label>
              <input type="date" id="bookingDate" v-model="editingBooking.date" required
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
            </div>
            <div class="mb-4">
              <label for="bookingTime" class="block text-soft-blue-700 text-sm font-bold mb-2">時間 <span class="text-red-500">*</span></label>
              <input type="time" id="bookingTime" v-model="editingBooking.time" required
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
            </div>
            <div class="mb-4">
              <label for="status" class="block text-soft-blue-700 text-sm font-bold mb-2">狀態</label>
              <select id="status" v-model="editingBooking.status"
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
                <option value="confirmed">已確認</option>
                <option value="pending">待處理</option>
                <option value="cancelled">已取消</option>
                <option value="completed">已完成</option>
              </select>
            </div>
            <div class="mb-6">
              <label for="notes" class="block text-soft-blue-700 text-sm font-bold mb-2">備註</label>
              <textarea id="notes" v-model="editingBooking.notes" rows="3"
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400"></textarea>
            </div>
            <button type="submit" :disabled="isLoading"
              class="w-full bg-soft-blue-600 hover:bg-soft-blue-700 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLoading ? '儲存中...' : (editingBooking.id ? '儲存變更' : '新增預約') }}
            </button>
            <button v-if="editingBooking.id" @click="deleteBooking(editingBooking.id)" type="button" :disabled="isLoading"
              class="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLoading ? '刪除中...' : '刪除預約' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useNotification } from '../../composables/useNotification';
import { saveBookings, loadBookings } from '../../services/dataService'; // 引入 dataService

const currentView = ref('month'); // 'day', 'week', 'month'
const currentDate = ref(new Date()); // 當前顯示的日期

const isModalOpen = ref(false);
const editingBooking = ref({}); // 用於新增或編輯的預約數據
const isLoading = ref(false); // 新增載入狀態

const bookings = ref([]); // 初始化為空陣列，將從 dataService 載入

// 模擬不開放預約時段 (實際應從後端獲取)
const blockedSlots = ref([
  { date: '2025-07-18', isBlocked: true, notes: '員工培訓' },
  { date: '2025-07-25', isBlocked: true, notes: '店休' },
]);

const { showSuccess, showError } = useNotification(); // 使用通知組合式函數

// 輔助函數：將 Date 物件格式化為 YYYY-MM-DD 字串 (本地日期)
function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份是從 0 開始的
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 從 dataService 載入預約數據
function loadBookingsData() {
  bookings.value = loadBookings();
}

// 組件掛載時載入數據
onMounted(() => {
  loadBookingsData();
});

// 計算當前顯示的日期範圍標題
const currentPeriod = computed(() => {
  const options = { year: 'numeric', month: 'long' };
  if (currentView.value === 'month') {
    return currentDate.value.toLocaleDateString('zh-TW', options);
  } else if (currentView.value === 'week') {
    const startOfWeek = new Date(currentDate.value);
    startOfWeek.setDate(currentDate.value.getDate() - startOfWeek.getDay()); // 設置為本週日
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric', year: 'numeric' })}`;
  } else { // day view
    return currentDate.value.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  }
});

// 生成日曆天數
const calendarDays = computed(() => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 正規化今天的日期，用於比較

  if (currentView.value === 'month') {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // 填充上個月的空白
    const startDay = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday...
    for (let i = 0; i < startDay; i++) {
      days.push({ date: '', dayOfMonth: '', isCurrentMonth: false, bookings: [], isBlocked: false, isToday: false });
    }

    // 填充本月天數
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateString = formatDateToYYYYMMDD(date);
      const dayBookings = bookings.value.filter(b => b.date === dateString);
      const isBlocked = blockedSlots.value.some(bs => bs.date === dateString && bs.isBlocked);
      const isToday = date.getTime() === today.getTime();
      days.push({
        date: dateString,
        dayOfMonth: i,
        isCurrentMonth: true,
        bookings: dayBookings,
        isBlocked: isBlocked,
        isToday: isToday
      });
    }
  } else if (currentView.value === 'week') {
    const startOfWeek = new Date(currentDate.value);
    startOfWeek.setDate(currentDate.value.getDate() - startOfWeek.getDay()); // 設置為本週日

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateString = formatDateToYYYYMMDD(date);
      const dayBookings = bookings.value.filter(b => b.date === dateString);
      const isBlocked = blockedSlots.value.some(bs => bs.date === dateString && bs.isBlocked);
      const isToday = date.getTime() === today.getTime();
      days.push({
        date: dateString,
        dayOfMonth: date.getDate(),
        isCurrentMonth: true, // 週視圖中，所有天數都視為「當前」
        bookings: dayBookings,
        isBlocked: isBlocked,
        isToday: isToday
      });
    }
  } else { // day view
    const date = new Date(currentDate.value);
    const dateString = formatDateToYYYYMMDD(date);
    const dayBookings = bookings.value.filter(b => b.date === dateString);
    const isBlocked = blockedSlots.value.some(bs => bs.date === dateString && bs.isBlocked);
    const isToday = date.getTime() === today.getTime();
    days.push({
      date: dateString,
      dayOfMonth: date.getDate(),
      isCurrentMonth: true, // 日視圖中，永遠是「當前」
      bookings: dayBookings,
      isBlocked: isBlocked,
      isToday: isToday
    });
  }
  return days;
});

// 根據預約狀態返回 CSS class
function getBookingStatusClass(status) {
  switch (status) {
    case 'confirmed': return 'bg-green-200 text-green-800';
    case 'pending': return 'bg-orange-200 text-orange-800';
    case 'cancelled': return 'bg-red-200 text-red-800';
    case 'completed': return 'bg-blue-200 text-blue-800';
    default: return 'bg-gray-200 text-gray-800';
  }
}

// 切換日曆視圖
function changeView(view) {
  currentView.value = view;
  // 實際應用中，這裡需要根據視圖重新計算 calendarDays 或調用日曆庫的方法
}

// 日曆導航
function navigateCalendar(direction) {
  if (currentView.value === 'month') {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + (direction === 'next' ? 1 : -1), 1);
  } else if (currentView.value === 'week') {
    currentDate.value = new Date(currentDate.value.setDate(currentDate.value.getDate() + (direction === 'next' ? 7 : -7)));
  } else { // day view
    currentDate.value = new Date(currentDate.value.setDate(currentDate.value.getDate() + (direction === 'next' ? 1 : -1)));
  }
  // 實際應用中，這裡需要重新載入該時間段的預約數據
}

// 打開預約模態框
function openBookingModal(booking = {}) {
  editingBooking.value = { ...booking }; // 複製一份，避免直接修改原始數據
  if (!editingBooking.value.date) {
    // 如果沒有傳入日期，預設為當前日期
    editingBooking.value.date = formatDateToYYYYMMDD(currentDate.value);
  }
  isModalOpen.value = true;
}

// 關閉預約模態框
function closeBookingModal() {
  isModalOpen.value = false;
  editingBooking.value = {}; // 清空編輯數據
}

// 儲存預約
async function saveBooking() {
  isLoading.value = true; // 開始載入
  console.log('儲存預約:', editingBooking.value);
  try {
    // 模擬後端 API 呼叫
    await new Promise(resolve => setTimeout(resolve, 800)); // 模擬網路延遲

    if (editingBooking.value.id) {
      // 編輯現有預約
      const index = bookings.value.findIndex(b => b.id === editingBooking.value.id);
      if (index !== -1) {
        bookings.value[index] = { ...editingBooking.value };
        showSuccess('預約已更新！'); // 替換為更友好的通知
      }
    } else {
      // 新增預約
      editingBooking.value.id = bookings.value.length > 0 ? Math.max(...bookings.value.map(b => b.id)) + 1 : 1;
      bookings.value.push({ ...editingBooking.value });
      showSuccess('預約已新增！'); // 替換為更友好的通知
    }
    saveBookings(bookings.value); // 保存數據
    closeBookingModal();
  } catch (error) {
    console.error('儲存預約失敗:', error);
    showError('儲存預約失敗，請稍後再試。'); // 替換為更友好的通知
  } finally {
    isLoading.value = false; // 結束載入
  }
}

// 刪除預約
async function deleteBooking(id) {
  if (confirm('您確定要刪除此預約嗎？')) {
    isLoading.value = true; // 開始載入
    console.log('刪除預約:', id);
    try {
      // 模擬後端 API 呼叫
      await new Promise(resolve => setTimeout(resolve, 800)); // 模擬網路延遲

      bookings.value = bookings.value.filter(b => b.id !== id);
      showSuccess('預約已刪除！'); // 替換為更友好的通知
      saveBookings(bookings.value); // 保存數據
      closeBookingModal();
    } catch (error) {
      console.error('刪除預約失敗:', error);
      showError('刪除預約失敗，請稍後再試。'); // 替換為更友好的通知
    } finally {
      isLoading.value = false; // 結束載入
    }
  }
}

// 監聽日期變化，重新計算日曆天數 (僅為簡化版日曆的需要)
watch(currentDate, () => {
  // 在實際整合日曆庫時，這裡可能不需要手動觸發
});
</script>

<style scoped>
/* 這裡可以放置 BookingCalendar 特有的樣式，但盡量使用 Tailwind CSS */
</style>