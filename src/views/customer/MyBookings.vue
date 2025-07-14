<template>
  <div class="min-h-screen bg-soft-blue-50 p-8">
    <h1 class="text-4xl font-bold text-soft-blue-800 text-center mb-10">我的預約紀錄</h1>

    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-8 border border-soft-blue-200">
      <section class="upcoming-bookings mb-10">
        <h2 class="text-3xl font-semibold text-soft-blue-700 mb-6">即將到來的預約</h2>
        <div v-if="upcomingBookings.length === 0" class="text-soft-blue-600 text-lg text-center py-8">
          目前沒有即將到來的預約。
        </div>
        <div class="booking-card bg-soft-blue-100 p-6 rounded-xl shadow-md mb-4 border border-soft-blue-200"
          v-for="booking in upcomingBookings" :key="booking.id">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div class="flex-grow mb-4 md:mb-0">
              <p class="text-soft-blue-800 text-xl font-bold mb-2">服務：{{ booking.serviceName }}</p>
              <p class="text-soft-blue-700 text-lg mb-1">日期：{{ booking.date }}</p>
              <p class="text-soft-blue-700 text-lg mb-1">時間：{{ booking.time }}</p>
              <p :class="['text-sm font-semibold', booking.status === 'confirmed' ? 'text-green-600' : 'text-orange-600']">
                狀態：{{ booking.status === 'confirmed' ? '已確認' : '待處理' }}
              </p>
            </div>
            <button @click="confirmCancel(booking.id)"
              class="px-6 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition duration-300 text-base">
              取消預約
            </button>
          </div>
        </div>
      </section>

      <section class="past-bookings">
        <h2 class="text-3xl font-semibold text-soft-blue-700 mb-6">歷史預約紀錄</h2>
        <div v-if="pastBookings.length === 0" class="text-soft-blue-600 text-lg text-center py-8">
          沒有歷史預約紀錄。
        </div>
        <div class="booking-card bg-gray-100 p-6 rounded-xl shadow-md mb-4 border border-gray-200"
          v-for="booking in pastBookings" :key="booking.id">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div class="flex-grow mb-4 md:mb-0">
              <p class="text-gray-800 text-xl font-bold mb-2">服務：{{ booking.serviceName }}</p>
              <p class="text-gray-700 text-lg mb-1">日期：{{ booking.date }}</p>
              <p class="text-gray-700 text-lg mb-1">時間：{{ booking.time }}</p>
              <p :class="['text-sm font-semibold', booking.status === 'completed' ? 'text-blue-600' : 'text-red-600']">
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
import { ref } from 'vue';

// 這裡僅為示意，實際應從後端獲取
const upcomingBookings = ref([
  { id: 101, serviceName: '手部光療', date: '2025-07-20', time: '14:00', status: 'confirmed' },
  { id: 102, serviceName: '頭皮深層護理', date: '2025-07-25', time: '10:30', status: 'pending' },
]);

const pastBookings = ref([
  { id: 98, serviceName: '日式嫁接睫毛', date: '2025-06-20', time: '16:00', status: 'completed' },
  { id: 97, serviceName: '美白保濕護膚', date: '2025-05-10', time: '11:00', status: 'cancelled' },
]);

function confirmCancel(bookingId) {
  if (confirm('您確定要取消這次的預約嗎？\n\n取消規則：預約前24小時內不可取消，否則可能產生費用。')) {
    cancelBooking(bookingId);
  }
}

function cancelBooking(bookingId) {
  console.log('嘗試取消預約:', bookingId);
  // 在此處加入呼叫後端 API 取消預約的邏輯
  // 模擬 API 呼叫
  setTimeout(() => {
    const index = upcomingBookings.value.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      const cancelledBooking = upcomingBookings.value.splice(index, 1)[0];
      cancelledBooking.status = 'cancelled';
      pastBookings.value.unshift(cancelledBooking); // 將取消的預約移到歷史紀錄
      alert('預約已成功取消！');
    } else {
      alert('取消失敗，找不到該預約。');
    }
  }, 500);
}
</script>

<style scoped>
/* 這裡可以放置 MyBookings 特有的樣式，但盡量使用 Tailwind CSS */
</style>
