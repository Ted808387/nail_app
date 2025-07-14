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

      <!-- 日曆主體 (簡化版) -->
      <div class="bg-soft-blue-100 p-6 rounded-xl min-h-[500px] border border-soft-blue-200 relative">
        <p class="text-soft-blue-600 text-xl text-center mb-4">
          {{ currentView === 'month' ? '月視圖' : currentView === 'week' ? '週視圖' : '日視圖' }}
        </p>
        <div class="grid grid-cols-7 gap-2 text-center font-semibold text-soft-blue-700 mb-4">
          <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
        </div>
        <div class="grid grid-cols-7 gap-2">
          <div v-for="day in calendarDays" :key="day.date"
            :class="['p-2 border rounded-md text-sm', day.isCurrentMonth ? 'bg-white text-soft-blue-800' : 'bg-gray-100 text-gray-500']">
            <p class="font-bold mb-1">{{ day.dayOfMonth }}</p>
            <div v-for="booking in day.bookings" :key="booking.id"
              :class="['text-xs p-1 rounded-sm mb-1 cursor-pointer', getBookingStatusClass(booking.status)]"
              @click="openBookingModal(booking)">
              {{ booking.time }} - {{ booking.clientName }} ({{ booking.serviceName }})
            </div>
            <div v-if="day.isBlocked" class="text-xs p-1 rounded-sm bg-red-200 text-red-800">
              不開放預約
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
            <button type="submit" class="w-full bg-soft-blue-600 hover:bg-soft-blue-700 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300">
              {{ editingBooking.id ? '儲存變更' : '新增預約' }}
            </button>
            <button v-if="editingBooking.id" @click="deleteBooking(editingBooking.id)" type="button"
              class="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300">
              刪除預約
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const currentView = ref('month'); // 'day', 'week', 'month'
const currentDate = ref(new Date()); // 當前顯示的日期

const isModalOpen = ref(false);
const editingBooking = ref({}); // 用於新增或編輯的預約數據

// 模擬預約數據 (實際應從後端獲取)
const bookings = ref([
  { id: 1, clientName: '王小明', serviceName: '手部光療', date: '2025-07-15', time: '10:00', status: 'confirmed', notes: '客戶偏好亮色系' },
  { id: 2, clientName: '李美玲', serviceName: '日式嫁接睫毛', date: '2025-07-15', time: '14:00', status: 'pending', notes: '' },
  { id: 3, clientName: '張大華', serviceName: '頭皮深層護理', date: '2025-07-16', time: '09:00', status: 'confirmed', notes: '首次體驗' },
  { id: 4, clientName: '陳小花', serviceName: '美白保濕護膚', date: '2025-07-20', time: '11:30', status: 'confirmed', notes: '' },
  { id: 5, clientName: '林大同', serviceName: '足部深層保養', date: '2025-07-22', time: '16:00', status: 'pending', notes: '需提早10分鐘到' },
]);

// 模擬不開放預約時段 (實際應從後端獲取)
const blockedSlots = ref([
  { date: '2025-07-18', isBlocked: true, notes: '員工培訓' },
  { date: '2025-07-25', isBlocked: true, notes: '店休' },
]);

// 計算當前顯示的日期範圍標題
const currentPeriod = computed(() => {
  const options = { year: 'numeric', month: 'long' };
  if (currentView.value === 'month') {
    return currentDate.value.toLocaleDateString('zh-TW', options);
  } else if (currentView.value === 'week') {
    const startOfWeek = new Date(currentDate.value);
    startOfWeek.setDate(currentDate.value.getDate() - currentDate.value.getDay()); // 設置為本週日
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric', year: 'numeric' })}`;
  } else { // day view
    return currentDate.value.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  }
});

// 生成日曆天數 (簡化版，僅月視圖)
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const days = [];

  // 填充上個月的空白
  const startDay = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday...
  for (let i = 0; i < startDay; i++) {
    days.push({ date: '', dayOfMonth: '', isCurrentMonth: false, bookings: [], isBlocked: false });
  }

  // 填充本月天數
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const date = new Date(year, month, i);
    const dateString = date.toISOString().split('T')[0];
    const dayBookings = bookings.value.filter(b => b.date === dateString);
    const isBlocked = blockedSlots.value.some(bs => bs.date === dateString && bs.isBlocked);
    days.push({
      date: dateString,
      dayOfMonth: i,
      isCurrentMonth: true,
      bookings: dayBookings,
      isBlocked: isBlocked
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
    editingBooking.value.date = currentDate.value.toISOString().split('T')[0]; // 預設為當前日期
  }
  isModalOpen.value = true;
}

// 關閉預約模態框
function closeBookingModal() {
  isModalOpen.value = false;
  editingBooking.value = {}; // 清空編輯數據
}

// 儲存預約
function saveBooking() {
  // 這裡應呼叫後端 API 儲存預約
  console.log('儲存預約:', editingBooking.value);
  if (editingBooking.value.id) {
    // 編輯現有預約
    const index = bookings.value.findIndex(b => b.id === editingBooking.value.id);
    if (index !== -1) {
      bookings.value[index] = { ...editingBooking.value };
      alert('預約已更新！');
    }
  } else {
    // 新增預約
    editingBooking.value.id = bookings.value.length > 0 ? Math.max(...bookings.value.map(b => b.id)) + 1 : 1;
    bookings.value.push({ ...editingBooking.value });
    alert('預約已新增！');
  }
  closeBookingModal();
}

// 刪除預約
function deleteBooking(id) {
  if (confirm('您確定要刪除此預約嗎？')) {
    console.log('刪除預約:', id);
    // 這裡應呼叫後端 API 刪除預約
    bookings.value = bookings.value.filter(b => b.id !== id);
    alert('預約已刪除！');
    closeBookingModal();
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
