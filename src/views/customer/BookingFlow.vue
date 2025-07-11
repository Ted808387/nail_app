<template>
  <div class="booking-flow-page">
    <h1>預約流程</h1>
    
    <!-- 步驟一: 選擇服務 (如果沒有從服務列表頁帶過來) -->
    <div v-if="currentStep === 1">
      <h2>步驟一：選擇服務</h2>
      <p>您選擇的服務是：{{ selectedServiceName }}</p>
      <!-- 這裡可以放一個服務選擇器 -->
      <button @click="nextStep">下一步：選擇時間</button>
    </div>

    <!-- 步驟二: 選擇日期與時間 -->
    <div v-if="currentStep === 2">
      <h2>步驟二：選擇日期與時間</h2>
      <!-- 這裡應該放一個日曆元件 -->
      <p>(日曆元件 placeholder)</p>
      <button @click="nextStep">下一步：確認預約</button>
    </div>

    <!-- 步驟三: 確認預約資訊 -->
    <div v-if="currentStep === 3">
      <h2>步驟三：確認您的預約</h2>
      <p>服務：{{ selectedServiceName }}</p>
      <p>時間：(所選時間 placeholder)</p>
      <p>價格：(服務價格 placeholder)</p>
      <button @click="confirmBooking">確認送出</button>
    </div>

    <!-- 步驟四: 預約成功 -->
    <div v-if="currentStep === 4">
      <h2>🎉 預約成功！</h2>
      <p>我們已經收到您的預約，期待您的光臨。</p>
      <router-link to="/my-bookings">查看我的預約</router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentStep = ref(1);

// 這裡僅為示意，實際應從後端獲取
const services = { 1: '手部光療', 2: '日式嫁接睫毛', 3: '頭皮護理' };
const selectedServiceId = ref(route.query.service || null);

const selectedServiceName = computed(() => services[selectedServiceId.value] || '尚未選擇');

function nextStep() {
  if (currentStep.value < 4) {
    currentStep.value++;
  }
}

function confirmBooking() {
  console.log('預約已確認');
  // 在此處加入呼叫後端 API 儲存預約的邏輯
  nextStep();
}

</script>

<style scoped>
.booking-flow-page { padding: 20px; }
</style>
