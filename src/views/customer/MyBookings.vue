<template>
  <div class="min-h-screen bg-soft-blue-50 p-8">
    <h1 class="text-4xl font-bold text-soft-blue-800 text-center mb-10">我的預約紀錄</h1>

    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-8 border border-soft-blue-200">
      <section class="upcoming-bookings mb-8">
        <h2 class="text-3xl font-semibold text-soft-blue-700 mb-6">即將到來的預約</h2>
        <div v-if="upcomingBookings.length === 0" class="text-soft-blue-600 text-lg">
          目前沒有即將到來的預約。
        </div>
        <div class="booking-card bg-soft-blue-100 p-6 rounded-xl shadow-md mb-4 border border-soft-blue-200"
          v-for="booking in upcomingBookings" :key="booking.id">
          <p class="text-soft-blue-800 text-xl font-bold mb-2">服務：{{ booking.serviceName }}</p>
          <p class="text-soft-blue-700 text-lg mb-1">日期：{{ booking.date }}</p>
          <p class="text-soft-blue-700 text-lg mb-4">時間：{{ booking.time }}</p>
          <button @click="cancelBooking(booking.id)"
            class="px-6 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition duration-300 text-base">
            取消預約
          </button>
        </div>
      </section>

      <section class="past-bookings">
        <h2 class="text-3xl font-semibold text-soft-blue-700 mb-6">歷史預約紀錄</h2>
        <div v-if="pastBookings.length === 0" class="text-soft-blue-600 text-lg">
          沒有歷史預約紀錄。
        </div>
        <div class="booking-card bg-gray-100 p-6 rounded-xl shadow-md mb-4 border border-gray-200"
          v-for="booking in pastBookings" :key="booking.id">
          <p class="text-gray-800 text-xl font-bold mb-2">服務：{{ booking.serviceName }}</p>
          <p class="text-gray-700 text-lg mb-1">日期：{{ booking.date }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 這裡僅為示意，實際應從後端獲取
const upcomingBookings = ref([
  { id: 101, serviceName: '手部光療', date: '2025-07-15', time: '14:00' },
]);

const pastBookings = ref([
  { id: 98, serviceName: '日式嫁接睫毛', date: '2025-06-20' },
  { id: 97, serviceName: '頭皮護理', date: '2025-05-10' },
]);

function cancelBooking(bookingId) {
  if (confirm('您確定要取消這次的預約嗎？')) {
    console.log('取消預約:', bookingId);
    // 在此處加入呼叫後端 API 取消預約的邏輯
    // 成功後從列表中移除
    upcomingBookings.value = upcomingBookings.value.filter(b => b.id !== bookingId);
  }
}
</script>

<style scoped>
/* 移除舊有 CSS，完全使用 Tailwind */
</style>