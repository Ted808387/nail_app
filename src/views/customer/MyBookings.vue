<template>
  <div class="min-h-screen bg-soft-blue-50 p-4 sm:p-6 md:p-8">
    <h1 class="text-3xl sm:text-4xl font-bold text-soft-blue-800 text-center mb-8 sm:mb-10">我的預約紀錄</h1>

    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 mb-6 sm:mb-8 border border-soft-blue-200">
      <section class="upcoming-bookings mb-8 sm:mb-10">
        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mb-5 sm:mb-6">即將到來的預約</h2>
        <div v-if="upcomingBookings.length === 0" class="text-soft-blue-600 text-base sm:text-lg text-center py-6 sm:py-8">
          目前沒有即將到來的預約。
        </div>
        <div class="booking-card bg-soft-blue-100 p-4 sm:p-6 rounded-xl shadow-md mb-3 sm:mb-4 border border-soft-blue-200"
          v-for="booking in upcomingBookings" :key="booking.id">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div class="flex-grow mb-3 md:mb-0">
              <p class="text-lg sm:text-xl font-bold text-soft-blue-800 mb-1">服務：{{ booking.serviceName }}</p>
              <p class="text-sm sm:text-base text-soft-blue-700 mb-1">日期：{{ booking.date }}</p>
              <p class="text-sm sm:text-base text-soft-blue-700 mb-1">時間：{{ booking.time }}</p>
              <p :class="['text-xs sm:text-sm font-semibold', booking.status === 'confirmed' ? 'text-green-600' : 'text-orange-600']">
                狀態：{{ booking.status === 'confirmed' ? '已確認' : '待處理' }}
              </p>
            </div>
            <button @click="confirmCancel(booking.id)" :disabled="isLoading"
              class="px-5 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLoading ? '取消中...' : '取消預約' }}
            </button>
          </div>
        </div>
      </section>

      <section class="past-bookings">
        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mb-5 sm:mb-6">歷史預約紀錄</h2>
        <div v-if="pastBookings.length === 0" class="text-soft-blue-600 text-base sm:text-lg text-center py-6 sm:py-8">
          沒有歷史預約紀錄。
        </div>
        <div class="booking-card bg-gray-100 p-4 sm:p-6 rounded-xl shadow-md mb-3 sm:mb-4 border border-gray-200"
          v-for="booking in pastBookings" :key="booking.id">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div class="flex-grow mb-3 md:mb-0">
              <p class="text-lg sm:text-xl font-bold text-gray-800 mb-1">服務：{{ booking.serviceName }}</p>
              <p class="text-sm sm:text-base text-gray-700 mb-1">日期：{{ booking.date }}</p>
              <p class="text-sm sm:text-base text-gray-700 mb-1">時間：{{ booking.time }}</p>
              <p :class="['text-xs sm:text-sm font-semibold', booking.status === 'completed' ? 'text-blue-600' : 'text-red-600']">
                狀態：{{ booking.status === 'completed' ? '已完成' : '已取消' }}
              </p>
            </div>
            <!-- 歷史預約通常不提供操作按鈕 -->
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'; // 引入 onMounted
import { useNotification } from '../../composables/useNotification';
import { loadBookings, saveBookings } from '../../services/dataService'; // 引入 dataService

const bookings = ref([]); // 初始化為空陣列
const isLoading = ref(false); // 新增載入狀態
const { showSuccess, showError } = useNotification(); // 使用通知組合式函數

// 組件掛載時載入數據
onMounted(() => {
  bookings.value = loadBookings();
});

const upcomingBookings = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookings.value.filter(booking => new Date(booking.date) >= today && booking.status !== 'cancelled');
});

const pastBookings = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookings.value.filter(booking => new Date(booking.date) < today || booking.status === 'cancelled');
});

function confirmCancel(bookingId) {
  if (confirm('您確定要取消這次的預約嗎？\n\n取消規則：預約前24小時內不可取消，否則可能產生費用。')) {
    cancelBooking(bookingId);
  }
}

async function cancelBooking(bookingId) {
  isLoading.value = true; // 開始載入
  console.log('嘗試取消預約:', bookingId);
  try {
    // 在此處加入呼叫後端 API 取消預約的邏輯
    await new Promise(resolve => setTimeout(resolve, 800)); // 模擬 API 呼叫

    const index = bookings.value.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings.value[index].status = 'cancelled'; // 更新狀態
      showSuccess('預約已成功取消！'); // 使用通知
    } else {
      showError('取消失敗，找不到該預約。'); // 使用通知
    }
    saveBookings(bookings.value); // 保存數據
  } catch (error) {
    console.error('取消預約失敗:', error);
    showError('取消預約失敗，請稍後再試。'); // 使用通知
  } finally {
    isLoading.value = false; // 結束載入
  }
}
</script>

<style scoped>
/* 這裡可以放置 MyBookings 特有的樣式，但盡量使用 Tailwind CSS */
</style>