<template>
  <div class="min-h-screen bg-soft-blue-50 p-8">
    <h1 class="text-4xl font-bold text-soft-blue-800 text-center mb-10">預約流程</h1>

    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-soft-blue-200">
      <!-- 步驟指示器 -->
      <div class="flex justify-around mb-8">
        <div :class="['flex-1 text-center py-2 rounded-full', currentStep >= 1 ? 'bg-soft-blue-600 text-white' : 'bg-gray-200 text-gray-600']">
          1. 選擇服務
        </div>
        <div :class="['flex-1 text-center py-2 rounded-full mx-2', currentStep >= 2 ? 'bg-soft-blue-600 text-white' : 'bg-gray-200 text-gray-600']">
          2. 選擇時間
        </div>
        <div :class="['flex-1 text-center py-2 rounded-full', currentStep >= 3 ? 'bg-soft-blue-600 text-white' : 'bg-gray-200 text-gray-600']">
          3. 確認預約
        </div>
      </div>

      <!-- 步驟一: 選擇服務 -->
      <div v-if="currentStep === 1">
        <h2 class="text-3xl font-semibold text-soft-blue-700 mb-6 text-center">步驟一：選擇服務</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="service in availableServices" :key="service.id"
            :class="['bg-soft-blue-50 p-6 rounded-xl shadow-md border cursor-pointer transition duration-300', selectedServiceIds.includes(service.id) ? 'border-soft-blue-600 ring-2 ring-soft-blue-500' : 'border-soft-blue-200 hover:border-soft-blue-400']"
            @click="toggleService(service.id)">
            <h3 class="text-xl font-semibold text-soft-blue-800 mb-2">{{ service.name }}</h3>
            <p class="text-soft-blue-600 text-sm mb-2">{{ service.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-soft-blue-700 font-medium">NT$ {{ service.price }}</span>
              <span class="text-soft-blue-500 text-sm">{{ service.duration }} 分鐘</span>
            </div>
          </div>
        </div>
        <p v-if="errors.services" class="text-red-500 text-sm text-center mt-4">{{ errors.services }}</p>
        <div class="flex justify-center mt-8">
          <button @click="goToStep(2)" :disabled="selectedServiceIds.length === 0"
            class="px-8 py-3 bg-soft-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            下一步：選擇時間 (總時長: {{ totalDuration }} 分鐘 / 總價: NT$ {{ totalPrice }})
          </button>
        </div>
      </div>

      <!-- 步驟二: 選擇日期與時間 -->
      <div v-if="currentStep === 2">
        <h2 class="text-3xl font-semibold text-soft-blue-700 mb-6 text-center">步驟二：選擇日期與時間</h2>
        <div class="bg-soft-blue-100 p-6 rounded-xl mb-8 border border-soft-blue-200">
          <p class="text-soft-blue-600 text-lg font-semibold mb-4">請選擇預約日期：</p>
          <!-- 簡易日曆 Placeholder -->
          <input type="date" v-model="selectedDate" :min="minDate"
            class="w-full p-3 border border-soft-blue-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-soft-blue-400">
          <p v-if="errors.date" class="text-red-500 text-sm mb-4">{{ errors.date }}</p>

          <p class="text-soft-blue-600 text-lg font-semibold mb-4">請選擇預約時間 (預計服務時長: {{ totalDuration }} 分鐘)：</p>
          <div class="grid grid-cols-3 gap-3">
            <button v-for="time in availableTimes" :key="time"
              :class="['p-3 rounded-lg text-center transition duration-200', selectedTime === time ? 'bg-soft-blue-600 text-white' : 'bg-soft-blue-200 text-soft-blue-800 hover:bg-soft-blue-300']"
              @click="selectedTime = time">
              {{ time }}
            </button>
          </div>
          <p v-if="errors.time" class="text-red-500 text-sm mt-4">{{ errors.time }}</p>
        </div>
        <div class="flex justify-between mt-8">
          <button @click="goToStep(1)"
            class="px-6 py-3 bg-gray-300 text-gray-800 text-lg font-semibold rounded-full shadow-md hover:bg-gray-400 transition duration-300">
            上一步
          </button>
          <button @click="goToStep(3)" :disabled="!selectedDate || !selectedTime"
            class="px-8 py-3 bg-soft-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            下一步：確認預約
          </button>
        </div>
      </div>

      <!-- 步驟三: 確認預約資訊 -->
      <div v-if="currentStep === 3">
        <h2 class="text-3xl font-semibold text-soft-blue-700 mb-6 text-center">步驟三：確認您的預約</h2>
        <div class="text-left text-lg text-soft-blue-700 mb-8 space-y-4 bg-soft-blue-50 p-6 rounded-xl border border-soft-blue-200">
          <p><strong>預約服務：</strong></p>
          <ul class="list-disc list-inside ml-4">
            <li v-for="service in selectedServicesDetails" :key="service.id">
              {{ service.name }} ({{ service.duration }} 分鐘, NT$ {{ service.price }})
            </li>
          </ul>
          <p><strong>總時長：</strong> {{ totalDuration }} 分鐘</p>
          <p><strong>總價格：</strong> NT$ {{ totalPrice }}</p>
          <p><strong>預約日期：</strong> {{ selectedDate }}</p>
          <p><strong>預約時間：</strong> {{ selectedTime }}</p>
          <p><strong>您的姓名：</strong> <input type="text" v-model="customerName" class="p-2 border rounded-md w-full mt-1"></p>
          <p><strong>您的 Email：</strong> <input type="email" v-model="customerEmail" class="p-2 border rounded-md w-full mt-1"></p>
          <p><strong>您的手機：</strong> <input type="tel" v-model="customerPhone" class="p-2 border rounded-md w-full mt-1"></p>
          <p><strong>備註 (選填)：</strong> <textarea v-model="bookingNotes" rows="3" class="p-2 border rounded-md w-full mt-1"></textarea></p>
          <p v-if="errors.customerInfo" class="text-red-500 text-sm">{{ errors.customerInfo }}</p>
        </div>
        <div class="flex justify-between mt-8">
          <button @click="goToStep(2)"
            class="px-6 py-3 bg-gray-300 text-gray-800 text-lg font-semibold rounded-full shadow-md hover:bg-gray-400 transition duration-300">
            上一步
          </button>
          <button @click="confirmBooking"
            class="px-8 py-3 bg-soft-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">
            確認送出
          </button>
        </div>
      </div>

      <!-- 步驟四: 預約成功 -->
      <div v-if="currentStep === 4" class="text-center">
        <h2 class="text-4xl font-bold text-soft-blue-800 mb-6">🎉 預約成功！</h2>
        <p class="text-xl text-soft-blue-700 mb-4">我們已經收到您的預約，期待您的光臨。</p>
        <p class="text-2xl font-bold text-soft-blue-900 mb-8">您的預約編號：{{ bookingId }}</p>
        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <router-link to="/my-bookings"
            class="px-8 py-3 bg-soft-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">
            查看我的預約
          </router-link>
          <button @click="addToCalendar"
            class="px-8 py-3 bg-white text-soft-blue-600 text-lg font-semibold rounded-full shadow-md border border-soft-blue-600 hover:bg-soft-blue-50 transition duration-300">
            加入我的日曆
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const currentStep = ref(1);
const selectedServiceIds = ref([]);
const selectedDate = ref('');
const selectedTime = ref('');
const customerName = ref('');
const customerEmail = ref('');
const customerPhone = ref('');
const bookingNotes = ref('');
const bookingId = ref(''); // 預約成功後生成的 ID
const errors = ref({});

// 模擬可用的服務數據 (實際應從後端獲取)
const availableServices = ref([
  { id: 1, name: '手部光療', description: '專業細緻的手部光療服務。', price: 1200, duration: 90 },
  { id: 2, name: '日式嫁接睫毛', description: '自然濃密的日式睫毛嫁接。', price: 1800, duration: 120 },
  { id: 3, name: '頭皮深層護理', description: '深層清潔與滋養頭皮。', price: 900, duration: 60 },
  { id: 4, name: '美白保濕護膚', description: '針對肌膚暗沉與乾燥問題。', price: 1500, duration: 90 },
  { id: 5, name: '足部深層保養', description: '專業足部去角質、修剪與滋潤。', price: 1000, duration: 60 },
]);

// 模擬可用時間 (實際應根據日期和服務時長從後端計算)
const availableTimes = ref([
  '09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00'
]);

// 設置最小可選日期為今天
const minDate = computed(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
});

// 從 URL 參數獲取預選服務
onMounted(() => {
  if (route.query.service) {
    const serviceId = parseInt(route.query.service);
    if (availableServices.value.some(s => s.id === serviceId)) {
      selectedServiceIds.value.push(serviceId);
    }
  }
});

// 計算總時長
const totalDuration = computed(() => {
  return selectedServiceIds.value.reduce((sum, id) => {
    const service = availableServices.value.find(s => s.id === id);
    return sum + (service ? service.duration : 0);
  }, 0);
});

// 計算總價格
const totalPrice = computed(() => {
  return selectedServiceIds.value.reduce((sum, id) => {
    const service = availableServices.value.find(s => s.id === id);
    return sum + (service ? service.price : 0);
  }, 0);
});

// 獲取已選服務的詳細資訊
const selectedServicesDetails = computed(() => {
  return selectedServiceIds.value.map(id => availableServices.value.find(s => s.id === id)).filter(Boolean);
});

// 切換服務選擇
function toggleService(serviceId) {
  const index = selectedServiceIds.value.indexOf(serviceId);
  if (index > -1) {
    selectedServiceIds.value.splice(index, 1);
  } else {
    selectedServiceIds.value.push(serviceId);
  }
}

// 步驟跳轉
function goToStep(step) {
  errors.value = {}; // 清除錯誤訊息
  if (step === 2) {
    if (selectedServiceIds.value.length === 0) {
      errors.value.services = '請至少選擇一項服務。';
      return;
    }
  } else if (step === 3) {
    if (!selectedDate.value) {
      errors.value.date = '請選擇預約日期。';
      return;
    }
    if (!selectedTime.value) {
      errors.value.time = '請選擇預約時間。';
      return;
    }
  }
  currentStep.value = step;
}

// 確認預約
async function confirmBooking() {
  errors.value = {};
  if (!customerName.value || !customerEmail.value || !customerPhone.value) {
    errors.value.customerInfo = '請填寫完整的聯絡資訊。';
    return;
  }
  // 這裡應呼叫後端 API 儲存預約
  console.log('提交預約資訊:', {
    services: selectedServiceIds.value,
    date: selectedDate.value,
    time: selectedTime.value,
    customerName: customerName.value,
    customerEmail: customerEmail.value,
    customerPhone: customerPhone.value,
    notes: bookingNotes.value,
    totalDuration: totalDuration.value,
    totalPrice: totalPrice.value,
  });

  // 模擬 API 成功響應，生成預約 ID
  bookingId.value = 'BOOK' + Math.random().toString(36).substr(2, 9).toUpperCase();
  currentStep.value = 4; // 進入成功頁
}

// 加入日曆功能 (Placeholder)
function addToCalendar() {
  alert('此功能將在未來版本中實現，可將預約添加到您的日曆。');
  // 實際應生成 ICS 文件或導向 Google Calendar / Outlook Calendar 的添加事件頁面
}
</script>

<style scoped>
/* 這裡可以放置 BookingFlow 特有的樣式，但盡量使用 Tailwind CSS */
</style>
