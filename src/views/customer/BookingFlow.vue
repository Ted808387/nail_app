<template>
  <div class="min-h-screen bg-soft-blue-50 p-8">
    <h1 class="text-4xl font-bold text-soft-blue-800 text-center mb-10">預約流程</h1>

    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-soft-blue-200">
      <!-- 步驟一: 選擇服務 (如果沒有從服務列表頁帶過來) -->
      <div v-if="currentStep === 1" class="text-center">
        <h2 class="text-3xl font-semibold text-soft-blue-700 mb-6">步驟一：選擇服務</h2>
        <p class="text-lg text-soft-blue-600 mb-8">您選擇的服務是：<span class="font-bold">{{ selectedServiceName }}</span></p>
        <!-- 這裡可以放一個服務選擇器 -->
        <button @click="nextStep"
          class="px-8 py-3 bg-soft-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">
          下一步：選擇時間
        </button>
      </div>

      <!-- 步驟二: 選擇日期與時間 -->
      <div v-if="currentStep === 2" class="text-center">
        <h2 class="text-3xl font-semibold text-soft-blue-700 mb-6">步驟二：選擇日期與時間</h2>
        <!-- 這裡應該放一個日曆元件 -->
        <div class="bg-soft-blue-100 p-10 rounded-xl mb-8 border border-soft-blue-200">
          <p class="text-soft-blue-600 text-lg">(日曆元件 placeholder)</p>
          <p class="text-soft-blue-500 text-sm mt-2">灰色代表不能約，亮色代表可以約</p>
        </div>
        <button @click="nextStep"
          class="px-8 py-3 bg-soft-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">
          下一步：確認預約
        </button>
      </div>

      <!-- 步驟三: 確認預約資訊 -->
      <div v-if="currentStep === 3" class="text-center">
        <h2 class="text-3xl font-semibold text-soft-blue-700 mb-6">步驟三：確認您的預約</h2>
        <div class="text-left text-lg text-soft-blue-700 mb-8 space-y-3">
          <p><strong>服務：</strong>{{ selectedServiceName }}</p>
          <p><strong>時間：</strong>(所選時間 placeholder)</p>
          <p><strong>價格：</strong>(服務價格 placeholder)</p>
        </div>
        <button @click="confirmBooking"
          class="px-8 py-3 bg-soft-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">
          確認送出
        </button>
      </div>

      <!-- 步驟四: 預約成功 -->
      <div v-if="currentStep === 4" class="text-center">
        <h2 class="text-4xl font-bold text-soft-blue-800 mb-6">🎉 預約成功！</h2>
        <p class="text-xl text-soft-blue-700 mb-8">我們已經收到您的預約，期待您的光臨。</p>
        <router-link to="/my-bookings"
          class="px-8 py-3 bg-soft-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">
          查看我的預約
        </router-link>
      </div>
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
/* 移除舊有 CSS，完全使用 Tailwind */
</style>