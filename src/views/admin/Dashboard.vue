<template>
  <div class="min-h-screen bg-soft-blue-50 p-4 sm:p-6 md:p-8">
    <h1 class="text-3xl sm:text-4xl font-bold text-soft-blue-800 text-center mb-8 sm:mb-10">管理員儀表板</h1>

    <!-- 關鍵數據概覽 -->
    <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10">
      <div class="stat-card bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center border border-soft-blue-200">
        <h3 class="text-lg sm:text-xl font-semibold text-soft-blue-700 mb-2 sm:mb-3">今日預約數</h3>
        <p class="text-3xl sm:text-4xl font-bold text-soft-blue-900">{{ dashboardData.todayAppointments }}</p>
      </div>
      <div class="stat-card bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center border border-soft-blue-200">
        <h3 class="text-lg sm:text-xl font-semibold text-soft-blue-700 mb-2 sm:mb-3">本週預估收入</h3>
        <p class="text-3xl sm:text-4xl font-bold text-soft-blue-900">NT$ {{ dashboardData.weeklyRevenue.toLocaleString() }}</p>
      </div>
      <div class="stat-card bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center border border-soft-blue-200">
        <h3 class="text-lg sm:text-xl font-semibold text-soft-blue-700 mb-2 sm:mb-3">本月新客戶</h3>
        <p class="text-3xl sm:text-4xl font-bold text-soft-blue-900">{{ dashboardData.newClientsMonth }}</p>
      </div>
      <div class="stat-card bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center border border-soft-blue-200">
        <h3 class="text-lg sm:text-xl font-semibold text-soft-blue-700 mb-2 sm:mb-3">待處理預約</h3>
        <p class="text-3xl sm:text-4xl font-bold text-soft-blue-900">{{ dashboardData.pendingAppointments }}</p>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="max-w-6xl mx-auto flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-8 sm:mb-10">
      <router-link to="/admin/calendar"
        class="px-5 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 text-base sm:text-lg font-semibold text-center">
        查看今日預約
      </router-link>
      <router-link to="/booking"
        class="px-5 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 text-base sm:text-lg font-semibold text-center">
        新增預約
      </router-link>
      <router-link to="/admin/services"
        class="px-5 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 text-base sm:text-lg font-semibold text-center">
        管理服務項目
      </router-link>
      <router-link to="/admin/clients"
        class="px-5 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 text-base sm:text-lg font-semibold text-center">
        客戶管理
      </router-link>
      <router-link to="/admin/settings"
        class="px-5 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 text-base sm:text-lg font-semibold text-center">
        營業設定
      </router-link>
    </div>

    <!-- 數據可視化區塊 -->
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
      <div class="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-soft-blue-200">
        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mb-5 sm:mb-6">預約趨勢 (本月)</h2>
        <div class="h-64 flex items-center justify-center text-soft-blue-500 text-base sm:text-lg">
          <!-- 這裡將放置圖表元件，例如 Chart.js 或 ECharts -->
          <p>圖表 Placeholder: 顯示本月預約數量趨勢</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-soft-blue-200">
        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mb-5 sm:mb-6">最受歡迎服務</h2>
        <ul class="list-disc list-inside text-soft-blue-700 text-base sm:text-lg">
          <li v-for="(service, index) in dashboardData.popularServices" :key="index" class="mb-1 sm:mb-2">
            {{ service.name }} ({{ service.count }} 次預約)
          </li>
        </ul>
        <div v-if="dashboardData.popularServices.length === 0" class="text-soft-blue-600 text-center text-base sm:text-lg">
          暫無數據。
        </div>
      </div>
    </div>

    <!-- 待處理預約列表 (可選) -->
    <div class="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-6 sm:mt-8 border border-soft-blue-200">
      <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mb-5 sm:mb-6">近期待處理預約</h2>
      <div v-if="dashboardData.recentPendingBookings.length === 0" class="text-soft-blue-600 text-center py-4 text-base sm:text-lg">
        目前沒有待處理的預約。
      </div>
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr>
                <th class="py-2 sm:py-3 px-3 sm:px-4 border-b-2 border-soft-blue-200 bg-soft-blue-100 text-left text-xs sm:text-sm font-semibold text-soft-blue-700 uppercase tracking-wider">
                  客戶
                </th>
                <th class="py-2 sm:py-3 px-3 sm:px-4 border-b-2 border-soft-blue-200 bg-soft-blue-100 text-left text-xs sm:text-sm font-semibold text-soft-blue-700 uppercase tracking-wider">
                  服務
                </th>
                <th class="py-2 sm:py-3 px-3 sm:px-4 border-b-2 border-soft-blue-200 bg-soft-blue-100 text-left text-xs sm:text-sm font-semibold text-soft-blue-700 uppercase tracking-wider">
                  日期
                </th>
                <th class="py-2 sm:py-3 px-3 sm:px-4 border-b-2 border-soft-blue-200 bg-soft-blue-100 text-left text-xs sm:text-sm font-semibold text-soft-blue-700 uppercase tracking-wider">
                  時間
                </th>
                <th class="py-2 sm:py-3 px-3 sm:px-4 border-b-2 border-soft-blue-200 bg-soft-blue-100 text-left text-xs sm:text-sm font-semibold text-soft-blue-700 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in dashboardData.recentPendingBookings" :key="booking.id" class="hover:bg-soft-blue-50">
                <td class="py-2 sm:py-3 px-3 sm:px-4 border-b border-soft-blue-200 text-soft-blue-800 text-xs sm:text-sm">{{ booking.clientName }}</td>
                <td class="py-2 sm:py-3 px-3 sm:px-4 border-b border-soft-blue-200 text-soft-blue-800 text-xs sm:text-sm">{{ booking.serviceName }}</td>
                <td class="py-2 sm:py-3 px-3 sm:px-4 border-b border-soft-blue-200 text-soft-blue-800 text-xs sm:text-sm">{{ booking.date }}</td>
                <td class="py-2 sm:py-3 px-3 sm:px-4 border-b border-soft-blue-200 text-soft-blue-800 text-xs sm:text-sm">{{ booking.time }}</td>
                <td class="py-2 sm:py-3 px-3 sm:px-4 border-b border-soft-blue-200">
                  <button @click="viewBookingDetail(booking)" class="text-soft-blue-600 hover:text-soft-blue-800 font-medium text-xs sm:text-sm">
                    查看詳情
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 預約詳情 Modal -->
    <div v-if="isModalOpen && selectedBooking" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg relative border border-soft-blue-200">
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl font-bold">&times;</button>
        <h2 class="text-2xl sm:text-3xl font-bold text-soft-blue-800 mb-5 sm:mb-6">預約詳情</h2>
        <div v-if="selectedBooking" class="space-y-4">
          <p class="text-soft-blue-700 text-base sm:text-lg"><strong>預約 ID:</strong> {{ selectedBooking.id }}</p>
          <p class="text-soft-blue-700 text-base sm:text-lg"><strong>客戶姓名:</strong> {{ selectedBooking.clientName }}</p>
          <p class="text-soft-blue-700 text-base sm:text-lg"><strong>服務項目:</strong> {{ selectedBooking.serviceName }}</p>
          <p class="text-soft-blue-700 text-base sm:text-lg"><strong>日期:</strong> {{ selectedBooking.date }}</p>
          <p class="text-soft-blue-700 text-base sm:text-lg"><strong>時間:</strong> {{ selectedBooking.time }}</p>
          <p><strong>狀態：</strong>
            <span v-if="!isEditing" :class="getStatusClass(selectedBooking.status)">{{ getStatusText(selectedBooking.status) }}</span>
            <select v-else v-model="selectedBooking.status" class="p-2 border rounded-md text-sm sm:text-base">
              <option value="pending">待處理</option>
              <option value="confirmed">已確認</option>
              <option value="cancelled">已取消</option>
              <option value="completed">已完成</option>
            </select>
          </p>
          <p><strong>備註：</strong>
            <span v-if="!isEditing">{{ selectedBooking.notes || '無' }}</span>
            <textarea v-else v-model="selectedBooking.notes" rows="3" class="p-2 border rounded-md w-full mt-1 text-sm sm:text-base" placeholder="請輸入備註"></textarea>
          </p>

          <div class="mt-6 sm:mt-8 flex justify-end space-x-4">
            <button v-if="!isEditing" @click="startEditing" :disabled="bookingStore.isLoading"
              class="px-6 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              編輯
            </button>
            <template v-else>
              <button @click="saveChanges" :disabled="bookingStore.isLoading"
                class="px-6 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ bookingStore.isLoading ? '儲存中...' : '儲存' }}
              </button>
              <button @click="cancelEditing" :disabled="bookingStore.isLoading"
                class="px-6 py-2 bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                取消
              </button>
            </template>
          </div>
        </div>
        <div v-else class="text-center text-soft-blue-600 text-base sm:text-lg py-8">
          載入預約詳情中...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNotification } from '../../composables/useNotification';
import { useBookingStore } from '../../stores/booking';
import { useClientStore } from '../../stores/client';
import { useServiceStore } from '../../stores/service';

const router = useRouter();
const bookingStore = useBookingStore();
const clientStore = useClientStore();
const serviceStore = useServiceStore();

const dashboardData = ref({
  todayAppointments: 0,
  weeklyRevenue: 0,
  newClientsMonth: 0,
  pendingAppointments: 0,
  popularServices: [],
  recentPendingBookings: [],
});

const isModalOpen = ref(false); // 控制 Modal 開關
const selectedBooking = ref(null); // 儲存選中的預約資料
const isEditing = ref(false); // 控制 Modal 內的編輯模式
const originalBooking = ref(null); // 用於儲存原始數據，以便取消編輯時恢復

const { showSuccess, showError } = useNotification();

const getStatusText = (status) => {
  switch (status) {
    case 'confirmed': return '已確認';
    case 'pending': return '待處理';
    case 'cancelled': return '已取消';
    case 'completed': return '已完成';
    default: return '未知';
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'confirmed': return 'text-green-600';
    case 'pending': return 'text-orange-600';
    case 'cancelled': return 'text-red-600';
    case 'completed': return 'text-blue-600';
    default: return 'text-gray-600';
  }
};

const fetchDashboardData = async () => {
  console.log('fetchDashboardData: 開始載入儀表板數據...');
  try {
    // 從 Pinia Store 獲取數據
    await Promise.all([
      bookingStore.fetchBookings(),
      clientStore.fetchClients(),
      serviceStore.fetchServices()
    ]);

    const allBookings = bookingStore.bookings;
    const allClients = clientStore.clients;
    const allServices = serviceStore.services;

    console.log('fetchDashboardData: 獲取到預約數據:', allBookings);
    console.log('fetchDashboardData: 獲取到客戶數據:', allClients);
    console.log('fetchDashboardData: 獲取到服務數據:', allServices);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // 本週日

    // 今日預約數
    dashboardData.value.todayAppointments = allBookings.filter(b => {
      const bookingDate = new Date(b.date);
      return bookingDate.toDateString() === today.toDateString() && b.status !== 'cancelled';
    }).length;

    // 本週預估收入
    dashboardData.value.weeklyRevenue = allBookings.filter(b => {
      const bookingDate = new Date(b.date);
      return bookingDate >= startOfWeek && bookingDate <= today && b.status === 'confirmed';
    }).reduce((sum, booking) => {
      const service = allServices.find(s => s.id === booking.service_id); // 假設 service_id 匹配
      return sum + (service ? service.price : 0);
    }, 0);

    // 本月新客戶
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    dashboardData.value.newClientsMonth = allClients.filter(c => {
      const regDate = new Date(c.registration_date); // 注意這裡的欄位名稱
      return regDate >= startOfMonth && regDate <= today; // 假設 registration_date 存在
    }).length;

    // 待處理預約
    dashboardData.value.pendingAppointments = allBookings.filter(b => b.status === 'pending').length;

    // 最受歡迎服務 (簡化：只計算預約次數)
    const serviceCounts = {};
    allBookings.forEach(b => {
      const service = allServices.find(s => s.id === b.service_id);
      if (service) {
        serviceCounts[service.name] = (serviceCounts[service.name] || 0) + 1;
      }
    });
    dashboardData.value.popularServices = Object.keys(serviceCounts)
      .map(name => ({ name, count: serviceCounts[name] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // 只顯示前3名

    // 近期待處理預約
    dashboardData.value.recentPendingBookings = allBookings.filter(b => b.status === 'pending')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5).map(b => ({
        ...b,
        clientName: allClients.find(c => c.id === b.user_id)?.name || '未知客戶',
        serviceName: allServices.find(s => s.id === b.service_id)?.name || '未知服務',
      }));
  } catch (error) {
    console.error('載入儀表板數據失敗:', error);
    showError('載入儀表板數據失敗，請稍後再試。');
  }
};

onMounted(() => {
  fetchDashboardData();
});

function viewBookingDetail(booking) {
  selectedBooking.value = { ...booking }; // 複製一份，避免直接修改列表中的數據
  originalBooking.value = { ...booking }; // 儲存原始數據
  isModalOpen.value = true;
  isEditing.value = false; // 預設為非編輯模式
}

function closeModal() {
  isModalOpen.value = false;
  selectedBooking.value = null;
  isEditing.value = false; // 關閉時重置編輯模式
  originalBooking.value = null; // 關閉時清空原始數據
}

function startEditing() {
  isEditing.value = true;
  originalBooking.value = { ...selectedBooking.value }; // 儲存當前狀態以便取消時恢復
}

async function saveChanges() {
  try {
    const updatedData = {
      notes: selectedBooking.value.notes,
      status: selectedBooking.value.status // Allow updating status from modal
    };
    await bookingStore.updateBooking(selectedBooking.value.id, updatedData);
    showSuccess('預約已成功更新！');
    isEditing.value = false;
    originalBooking.value = null; // Clear original data
    fetchDashboardData(); // Reload dashboard data to reflect changes
  } catch (error) {
    console.error('儲存變更失敗:', error);
    showError(bookingStore.error || '儲存變更失敗，請稍後再試。');
  }
}

function cancelEditing() {
  selectedBooking.value = { ...originalBooking.value }; // 恢復原始數據
  isEditing.value = false;
  originalBooking.value = null; // 清空原始數據
}
</script>

<style scoped>
/* 這裡可以放置 Dashboard 特有的樣式，但盡量使用 Tailwind CSS */
</style>