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
                  <button @click="viewBookingDetail(booking.id)" class="text-soft-blue-600 hover:text-soft-blue-800 font-medium text-xs sm:text-sm">
                    查看詳情
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const dashboardData = ref({
  todayAppointments: 0,
  weeklyRevenue: 0,
  newClientsMonth: 0,
  pendingAppointments: 0,
  popularServices: [],
  recentPendingBookings: [],
});

// 模擬從後端獲取數據
const fetchDashboardData = () => {
  // 實際應用中，這裡會發送 HTTP 請求到後端 API
  // 例如：axios.get('/api/admin/dashboard')
  setTimeout(() => {
    dashboardData.value = {
      todayAppointments: 7,
      weeklyRevenue: 35000,
      newClientsMonth: 15,
      pendingAppointments: 3,
      popularServices: [
        { name: '手部光療', count: 50 },
        { name: '日式嫁接睫毛', count: 45 },
        { name: '頭皮深層護理', count: 30 },
      ],
      recentPendingBookings: [
        { id: 201, clientName: '王小明', serviceName: '美白保濕護膚', date: '2025-07-16', time: '10:00' },
        { id: 202, clientName: '李美玲', serviceName: '足部深層保養', date: '2025-07-16', time: '15:30' },
        { id: 203, clientName: '張大華', serviceName: '手部光療', date: '2025-07-17', time: '09:00' },
      ],
    };
  }, 500);
};

onMounted(() => {
  fetchDashboardData();
});

function viewBookingDetail(bookingId) {
  // 導向到預約詳情頁面，可能需要一個新的路由或彈窗
  console.log('查看預約詳情:', bookingId);
  // router.push(`/admin/bookings/${bookingId}`); // 假設有這樣的路由
}
</script>

<style scoped>
/* 這裡可以放置 Dashboard 特有的樣式，但盡量使用 Tailwind CSS */
</style>