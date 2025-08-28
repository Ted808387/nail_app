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
        <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative border border-soft-blue-200 max-h-[90vh] overflow-y-auto">
          <button @click="closeBookingModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold">&times;</button>
          <h2 class="text-3xl font-bold text-soft-blue-800 mb-6">{{ editingBooking.booking_reference_id ? '編輯' : '新增' }}預約</h2>
          <form @submit.prevent="saveBooking">
            <div class="mb-4">
              <label for="clientName" class="block text-soft-blue-700 text-sm font-bold mb-2">客戶姓名 <span class="text-red-500">*</span></label>
              <input type="text" id="clientName" v-model="editingBooking.clientName" required
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
            </div>
            <div class="mb-4">
              <label for="customerEmail" class="block text-soft-blue-700 text-sm font-bold mb-2">客戶 Email</label>
              <input type="email" id="customerEmail" v-model="editingBooking.customer_email"
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
            </div>
            <div class="mb-4">
              <label for="customerPhone" class="block text-soft-blue-700 text-sm font-bold mb-2">客戶電話</label>
              <input type="text" id="customerPhone" v-model="editingBooking.customer_phone"
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
            </div>
            <div class="mb-4">
              <label for="serviceId" class="block text-soft-blue-700 text-sm font-bold mb-2">服務項目 <span class="text-red-500">*</span></label>
              <select id="serviceId" v-model="editingBooking.service_id" required
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400 bg-white">
                <option disabled value="">請選擇一個服務</option>
                <option v-for="service in serviceStore.services" :key="service.id" :value="service.id">
                  {{ service.name }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label for="bookingDate" class="block text-soft-blue-700 text-sm font-bold mb-2">日期 <span class="text-red-500">*</span></label>
              <input type="date" id="bookingDate" v-model="editingBooking.date" :disabled="editingBooking.id" required
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed">
            </div>
            <div class="mb-4">
              <label for="bookingTime" class="block text-soft-blue-700 text-sm font-bold mb-2">時間 <span class="text-red-500">*</span></label>
              <input type="time" id="bookingTime" v-model="editingBooking.time" :disabled="editingBooking.id" required
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed">
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
            <button type="submit" :disabled="bookingStore.isLoading || serviceStore.isLoading || clientStore.isLoading || businessSettingsStore.isLoading"
              class="w-full bg-soft-blue-600 hover:bg-soft-blue-700 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ bookingStore.isLoading ? '儲存中...' : (editingBooking.id ? '儲存變更' : '新增預約') }}
            </button>
            <button v-if="editingBooking.id" @click="deleteBooking(editingBooking.id)" type="button" :disabled="bookingStore.isLoading || serviceStore.isLoading || clientStore.isLoading || businessSettingsStore.isLoading"
              class="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ bookingStore.isLoading ? '刪除中...' : '刪除預約' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useNotification } from '@/composables/useNotification.js';
import { useAuthStore } from '../../stores/auth';
import { useBookingStore } from '../../stores/booking';
import { useServiceStore } from '../../stores/service';
import { useClientStore } from '../../stores/client';
import { useBusinessSettingsStore } from '../../stores/businessSettings';

const authStore = useAuthStore();
const bookingStore = useBookingStore();
const serviceStore = useServiceStore();
const clientStore = useClientStore();
const businessSettingsStore = useBusinessSettingsStore();

const currentView = ref('month'); // 'day', 'week', 'month'
const currentDate = ref(new Date()); // 當前顯示的日期

const isModalOpen = ref(false);
const editingBooking = ref({}); // 用於新增或編輯的預約數據

const { showSuccess, showError } = useNotification(); // 使用通知組合式函數

// 輔助函數：將 Date 物件格式化為 YYYY-MM-DD 字串 (本地日期)
function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份是從 0 開始的
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 組件掛載時載入數據
onMounted(async () => {
  try {
    await Promise.all([
      bookingStore.fetchAllBookings(),
      serviceStore.fetchServices(),
      clientStore.fetchClients(),
      businessSettingsStore.fetchBusinessSettings(),
    ]);
    console.log('Business settings loaded:', businessSettingsStore.settings);
  } catch (error) {
    console.error('載入數據失敗:', error);
    showError('載入數據失敗，請稍後再試。');
  }
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

  const bookings = bookingStore.bookings; // 從 store 獲取 bookings
  const availableServices = serviceStore.services; // 從 store 獲取 services
  const allClients = clientStore.clients; // 從 store 獲取 clients
  const businessHours = businessSettingsStore.settings?.business_hours || [];
  const holidays = businessSettingsStore.settings?.holidays || [];
  const unavailableDates = businessSettingsStore.settings?.unavailable_dates || [];

  // 輔助函數，用於處理單個預約對象，添加客戶和服務名稱
  const mapBookingDetails = (booking) => ({
    ...booking,
    clientName: booking.clientName || allClients.find(c => c.id === booking.user_id)?.name || '未知客戶',
    serviceName: availableServices.find(s => s.id === booking.service_id)?.name || '未知服務',
  });

  if (currentView.value === 'month') {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDay = firstDayOfMonth.getDay();
    for (let i = 0; i < startDay; i++) {
      days.push({ date: '', dayOfMonth: '', isCurrentMonth: false, bookings: [], isBlocked: false, isToday: false });
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateString = formatDateToYYYYMMDD(date);
      const dayBookings = bookings.filter(b => b.date === dateString).map(mapBookingDetails);
      const isBlocked = isDayBlocked(date, dateString, businessHours, holidays, unavailableDates);
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
    startOfWeek.setDate(currentDate.value.getDate() - startOfWeek.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateString = formatDateToYYYYMMDD(date);
      const dayBookings = bookings.filter(b => b.date === dateString).map(mapBookingDetails);
      const isBlocked = isDayBlocked(date, dateString, businessHours, holidays, unavailableDates);
      const isToday = date.getTime() === today.getTime();

      days.push({
        date: dateString,
        dayOfMonth: date.getDate(),
        isCurrentMonth: true,
        bookings: dayBookings,
        isBlocked: isBlocked,
        isToday: isToday
      });
    }
  } else { // day view
    const date = new Date(currentDate.value);
    const dateString = formatDateToYYYYMMDD(date);
    const dayBookings = bookings.filter(b => b.date === dateString).map(mapBookingDetails);
    const isBlocked = isDayBlocked(date, dateString, businessHours, holidays, unavailableDates);
    const isToday = date.getTime() === today.getTime();

    days.push({
      date: dateString,
      dayOfMonth: date.getDate(),
      isCurrentMonth: true,
      bookings: dayBookings,
      isBlocked: isBlocked,
      isToday: isToday
    });
  }
  return days;
});

// 判斷某一天是否被阻擋（不可預約）的函數
function isDayBlocked(date, dateString, businessHours, holidays, unavailableDates) {
  const isHoliday = holidays.some(h => h.date === dateString);
  const isUnavailable = unavailableDates.some(ud => ud.date === dateString);
  const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const businessDay = businessHours.find(d => d.id === (dayOfWeek === 0 ? 7 : dayOfWeek));
  const isClosedDay = businessDay ? businessDay.isClosed : true; // 如果沒有設定，預設為關閉

  return isHoliday || isUnavailable || isClosedDay;
}

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
  // 複製一份，避免直接修改原始數據
  editingBooking.value = { ...booking };

  // 如果是編輯現有預約，從 user_id 和 service_id 填充 clientName 和 serviceName
  if (editingBooking.value.user_id) {
    const client = clientStore.clients.find(c => c.id === editingBooking.value.user_id);
    if (client) {
      editingBooking.value.clientName = client.name;
      editingBooking.value.originalClientName = client.name; // 儲存原始客戶姓名
    }
  }
  if (editingBooking.value.service_id) {
    const service = serviceStore.services.find(s => s.id === editingBooking.value.service_id);
    if (service) {
      editingBooking.value.serviceName = service.name;
    }
  }

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
try {
  let bookingData = {};
  let userId = null;
  let customerName = editingBooking.value.clientName;
  let customerEmail = editingBooking.value.customer_email;
  let customerPhone = editingBooking.value.customer_phone;

  // 處理客戶資訊：如果輸入的客戶姓名對應到已註冊的客戶，就使用該客戶的 ID
  const client = clientStore.clients.find(c => c.name === customerName);
  if (client) {
    userId = client.id;
    customerName = null;
    customerEmail = null;
    customerPhone = null;
  } else {
    userId = null;
  }

  // 檢查服務項目是否已從下拉選單中選擇
  if (!editingBooking.value.service_id) {
    showError('請選擇一個服務項目。');
    return;
  }

  if (editingBooking.value.id) {
    // --- 編輯模式 ---
    bookingData = {
      ...editingBooking.value,
      user_id: userId,
      service_id: editingBooking.value.service_id, // 直接從 v-model 獲取
      status: editingBooking.value.status,
      notes: editingBooking.value.notes,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
    };
    await bookingStore.updateBooking(editingBooking.value.id, bookingData);
    showSuccess('預約已更新！');
  } else {
    // --- 新增模式 ---
    bookingData = {
      user_id: userId,
      service_id: editingBooking.value.service_id, // 直接從 v-model 獲取
      date: editingBooking.value.date,
      time: editingBooking.value.time,
      status: editingBooking.value.status || 'pending',
      notes: editingBooking.value.notes,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
    };
    await bookingStore.saveBooking(bookingData);
    showSuccess('預約已新增！');
  }
  closeBookingModal();
  } catch (error) {
    console.error('儲存預約失敗:', error);
    showError(bookingStore.error || '儲存預約失敗，請檢查所有必填欄位。');
  }
}
// 儲存預約
// async function saveBooking() {
//   try {
//     let bookingData = {};
//     let userId = null;
//     let customerName = editingBooking.value.clientName;
//     let customerEmail = editingBooking.value.customer_email;
//     let customerPhone = editingBooking.value.customer_phone;

//     // 處理客戶資訊：如果輸入的客戶姓名對應到已註冊的客戶，就使用該客戶的 ID
//     const client = clientStore.clients.find(c => c.name === customerName);
//     if (client) {
//       userId = client.id;
//       customerName = null;
//       customerEmail = null;
//       customerPhone = null;
//     } else {
//       userId = null;
//     }

//     // 檢查服務項目是否已選擇
//     if (!editingBooking.value.service_id) {
//       showError('請選擇一個服務項目。');
//       return;
//     }

//     if (editingBooking.value.id) {
//       // --- 編輯模式 ---
//       bookingData = {
//         ...editingBooking.value,
//         user_id: userId,
//         service_id: editingBooking.value.service_id, // 直接從 v-model 獲取
//         status: editingBooking.value.status,
//         notes: editingBooking.value.notes,
//         customer_name: customerName,
//         customer_email: customerEmail,
//         customer_phone: customerPhone,
//       };
//       await bookingStore.updateBooking(editingBooking.value.id, bookingData);
//       // showSuccess('預約已更新！');
//     } else {
//       // --- 新增模式 ---
//       bookingData = {
//         user_id: userId,
//         service_id: editingBooking.value.service_id, // 直接從 v-model 獲取
//         date: editingBooking.value.date,
//         time: editingBooking.value.time,
//         status: editingBooking.value.status || 'pending',
//         notes: editingBooking.value.notes,
//         customer_name: customerName,
//         customer_email: customerEmail,
//         customer_phone: customerPhone,
//       };
//       await bookingStore.saveBooking(bookingData);
//       // showSuccess('預約已新增！');
//     }

//     closeBookingModal();
//   } catch (error) {
//     console.error('儲存預約失敗:', error);
//     showError(bookingStore.error || '儲存預約失敗，請檢查所有必填欄位。');
//   }
// }

// 刪除預約
async function deleteBooking(id) {
  if (confirm('您確定要刪除此預約嗎？')) {
    // isLoading.value = true; // 開始載入
    try {
      await bookingStore.deleteBooking(id); // 調用 Pinia Store 的 action
      showSuccess('預約已刪除！');
      // 重新載入所有預約以更新日曆顯示 (Pinia Store 會自動更新，這裡不需要手動重新載入)
      // bookings.value = await fetchBookings();
      closeBookingModal();
    } catch (error) {
      console.error('刪除預約失敗:', error);
      showError(bookingStore.error || '刪除預約失敗，請稍後再試。');
    } finally {
      // isLoading.value = false; // 結束載入
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