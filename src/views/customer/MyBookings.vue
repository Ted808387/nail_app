<template>
  <div class="my-bookings-page">
    <h1>我的預約紀錄</h1>

    <section class="upcoming-bookings">
      <h2>即將到來的預約</h2>
      <div v-if="upcomingBookings.length === 0">目前沒有即將到來的預約。</div>
      <div class="booking-card" v-for="booking in upcomingBookings" :key="booking.id">
        <p><strong>服務：</strong>{{ booking.serviceName }}</p>
        <p><strong>日期：</strong>{{ booking.date }}</p>
        <p><strong>時間：</strong>{{ booking.time }}</p>
        <button @click="cancelBooking(booking.id)">取消預約</button>
      </div>
    </section>

    <section class="past-bookings">
      <h2>歷史預約紀錄</h2>
      <div v-if="pastBookings.length === 0">沒有歷史預約紀錄。</div>
      <div class="booking-card" v-for="booking in pastBookings" :key="booking.id">
        <p><strong>服務：</strong>{{ booking.serviceName }}</p>
        <p><strong>日期：</strong>{{ booking.date }}</p>
      </div>
    </section>
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
.my-bookings-page { padding: 20px; }
section { margin-bottom: 30px; }
.booking-card { border: 1px solid #ddd; border-radius: 5px; padding: 15px; margin-bottom: 10px; }
</style>
