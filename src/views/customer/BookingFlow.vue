<template>
  <div class="min-h-screen bg-soft-blue-50 p-4 sm:p-6 md:p-8">
    <h1 class="text-3xl sm:text-4xl font-bold text-soft-blue-800 text-center mb-8 sm:mb-10">預約流程</h1>

    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-soft-blue-200">
      <!-- 步驟指示器 -->
      <div class="flex justify-around mb-6 sm:mb-8 text-sm sm:text-base">
        <div :class="['flex-1 text-center py-2 rounded-full', currentStep >= 1 ? 'bg-soft-blue-600 text-white' : 'bg-gray-200 text-gray-600']">
          1. 選擇服務
        </div>
        <div :class="['flex-1 text-center py-2 rounded-full mx-1 sm:mx-2', currentStep >= 2 ? 'bg-soft-blue-600 text-white' : 'bg-gray-200 text-gray-600']">
          2. 選擇時間
        </div>
        <div :class="['flex-1 text-center py-2 rounded-full', currentStep >= 3 ? 'bg-soft-blue-600 text-white' : 'bg-gray-200 text-gray-600']">
          3. 確認預約
        </div>
      </div>

      <!-- 步驟一: 選擇服務 -->
      <div v-if="currentStep === 1">
        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mb-5 sm:mb-6 text-center">步驟一：選擇服務</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div v-for="service in availableServices" :key="service.id"
            :class="['bg-soft-blue-50 p-4 sm:p-6 rounded-xl shadow-md border cursor-pointer transition duration-300', selectedServiceIds.includes(service.id) ? 'border-soft-blue-600 ring-2 ring-soft-blue-500' : 'border-soft-blue-200 hover:border-soft-blue-400']"
            @click="toggleService(service.id)">
            <h3 class="text-xl sm:text-2xl font-semibold text-soft-blue-800 mb-1">{{ service.name }}</h3>
            <p class="text-sm sm:text-base text-soft-blue-600 mb-2">{{ service.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-base sm:text-lg font-medium text-soft-blue-700">NT$ {{ service.price }}</span>
              <span class="text-xs sm:text-sm text-soft-blue-500">{{ service.duration }} 分鐘</span>
            </div>
          </div>
        </div>
        <p v-if="errors.services" class="text-red-500 text-sm text-center mt-3 sm:mt-4">{{ errors.services }}</p>
        <div class="flex justify-center mt-6 sm:mt-8">
          <button @click="goToStep(2)" :disabled="selectedServiceIds.length === 0"
            class="px-6 sm:px-8 py-2 sm:py-3 bg-soft-blue-600 text-white text-base sm:text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            下一步：選擇時間 (總時長: {{ totalDuration }} 分鐘 / 總價: NT$ {{ totalPrice }})
          </button>
        </div>
      </div>

      <!-- 步驟二: 選擇日期與時間 -->
      <div v-if="currentStep === 2">
        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mb-5 sm:mb-6 text-center">步驟二：選擇日期與時間</h2>
        <div class="bg-soft-blue-100 p-4 sm:p-6 rounded-xl mb-6 sm:mb-8 border border-soft-blue-200">
          <p class="text-base sm:text-lg font-semibold text-soft-blue-600 mb-3 sm:mb-4">請選擇預約日期：</p>
          <!-- 簡易日曆 Placeholder -->
          <input type="date" v-model="selectedDate" :min="minDate"
            class="w-full p-2 sm:p-3 border border-soft-blue-300 rounded-lg mb-3 sm:mb-4 focus:outline-none focus:ring-2 focus:ring-soft-blue-400">
          <p v-if="errors.date" class="text-red-500 text-sm mb-3 sm:mb-4">{{ errors.date }}</p>

          <p class="text-base sm:text-lg font-semibold text-soft-blue-600 mb-3 sm:mb-4">請選擇預約時間 (預計服務時長: {{ totalDuration }} 分鐘)：</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            <button v-for="time in availableTimes" :key="time"
              :class="['p-2 sm:p-3 rounded-lg text-center transition duration-200 text-sm sm:text-base', selectedTime === time ? 'bg-soft-blue-600 text-white' : 'bg-soft-blue-200 text-soft-blue-800 hover:bg-soft-blue-300']"
              @click="selectedTime = time">
              {{ time }}
            </button>
          </div>
          <p v-if="errors.time" class="text-red-500 text-sm mt-3 sm:mt-4">{{ errors.time }}</p>
        </div>
        <div class="flex justify-between mt-6 sm:mt-8">
          <button @click="goToStep(1)"
            class="px-5 sm:px-6 py-2 sm:py-3 bg-gray-300 text-gray-800 text-base sm:text-lg font-semibold rounded-full shadow-md hover:bg-gray-400 transition duration-300">
            上一步
          </button>
          <button @click="goToStep(3)" :disabled="!selectedDate || !selectedTime"
            class="px-6 sm:px-8 py-2 sm:py-3 bg-soft-blue-600 text-white text-base sm:text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            下一步：確認預約
          </button>
        </div>
      </div>

      <!-- 步驟三: 確認預約資訊 -->
      <div v-if="currentStep === 3">
        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mb-5 sm:mb-6 text-center">步驟三：確認您的預約</h2>
        <div class="text-left text-base sm:text-lg text-soft-blue-700 mb-6 sm:mb-8 space-y-3 sm:space-y-4 bg-soft-blue-50 p-4 sm:p-6 rounded-xl border border-soft-blue-200">
          <p><strong>預約服務：</strong></p>
          <ul class="list-disc list-inside ml-2 sm:ml-4">
            <li v-for="service in selectedServicesDetails" :key="service.id">
              {{ service.name }} ({{ service.duration }} 分鐘, NT$ {{ service.price }})
            </li>
          </ul>
          <p><strong>總時長：</strong> {{ totalDuration }} 分鐘</p>
          <p><strong>總價格：：</strong> <input type="tel" v-model="customerPhone" class="p-2 border rounded-md w-full mt-1 text-sm sm:text-base"></p>
          <p><strong>備註 (選填)：：</strong> <textarea v-model="bookingNotes" rows="3" class="p-2 border rounded-md w-full mt-1 text-sm sm:text-base"></textarea></p>
          <p v-if="errors.customerInfo" class="text-red-500 text-sm">{{ errors.customerInfo }}</p>
        </div>
        <div class="flex justify-between mt-6 sm:mt-8">
          <button @click="goToStep(2)"
            class="px-5 sm:px-6 py-2 sm:py-3 bg-gray-300 text-gray-800 text-base sm:text-lg font-semibold rounded-full shadow-md hover:bg-gray-400 transition duration-300">
            上一步
          </button>
          <button @click="confirmBooking" :disabled="isLoading"
            class="px-6 sm:px-8 py-2 sm:py-3 bg-soft-blue-600 text-white text-base sm:text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? '送出中...' : '確認送出' }}
          </button>
        </div>
      </div>

      <!-- 步驟四: 預約成功 -->
      <div v-if="currentStep === 4" class="text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-soft-blue-800 mb-4 sm:mb-6">🎉 預約成功！</h2>
        <p class="text-lg sm:text-xl text-soft-blue-700 mb-3 sm:mb-4">我們已經收到您的預約，期待您的光臨。</p>
        <p class="text-xl sm:text-2xl font-bold text-soft-blue-900 mb-6 sm:mb-8">您的預約編號：{{ bookingId }}</p>
        <div class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <router-link to="/my-bookings"
            class="px-6 sm:px-8 py-2 sm:py-3 bg-soft-blue-600 text-white text-base sm:text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300">
            查看我的預約
          </router-link>
          <button @click="addToCalendar" :disabled="isLoading"
            class="px-6 sm:px-8 py-2 sm:py-3 bg-white text-soft-blue-600 text-base sm:text-lg font-semibold rounded-full shadow-md border border-soft-blue-600 hover:bg-soft-blue-50 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? '加入中...' : '加入我的日曆' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '../../composables/useNotification';
import { fetchServices, fetchBookings, saveBooking } from '../../api'; // 引入 API 函數

const route = useRoute();
const router = useRouter();
const { showSuccess, showError, showInfo } = useNotification();

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
const isLoading = ref(false); // 新增載入狀態

const availableServices = ref([]); // 初始化為空陣列
const bookings = ref([]); // 初始化為空陣列

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
onMounted(async () => {
  try {
    availableServices.value = await fetchServices(); // 從 API 載入服務數據
    bookings.value = await fetchBookings(); // 從 API 載入預約數據

    if (route.query.service) {
      const serviceId = parseInt(route.query.service);
      if (availableServices.value.some(s => s.id === serviceId)) {
        selectedServiceIds.value.push(serviceId);
      }
    }
  } catch (error) {
    console.error('載入數據失敗:', error);
    showError('載入數據失敗，請稍後再試。');
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
      showError('請至少選擇一項服務。'); // 使用通知
      errors.value.services = '請至少選擇一項服務。';
      return;
    }
  } else if (step === 3) {
    if (!selectedDate.value) {
      showError('請選擇預約日期。'); // 使用通知
      errors.value.date = '請選擇預約日期。';
      return;
    }
    if (!selectedTime.value) {
      showError('請選擇預約時間。'); // 使用通知
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
    showError('請填寫完整的聯絡資訊。'); // 使用通知
    errors.value.customerInfo = '請填寫完整的聯絡資訊。';
    return;
  }

  isLoading.value = true; // 開始載入
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

  try {
    // 將新預約添加到 bookings 陣列並保存
    const newBooking = {
      id: bookings.value.length > 0 ? Math.max(...bookings.value.map(b => b.id)) + 1 : 1,
      clientName: customerName.value,
      serviceName: selectedServicesDetails.value.map(s => s.name).join(', '), // 組合服務名稱
      date: selectedDate.value,
      time: selectedTime.value,
      status: 'pending', // 新預約預設為待處理
      notes: bookingNotes.value,
    };
    const savedBooking = await saveBooking(newBooking); // 調用 API 函數

    bookingId.value = savedBooking.id;
    showSuccess('預約成功！'); // 使用通知
    currentStep.value = 4; // 進入成功頁
  } catch (error) {
    console.error('預約失敗:', error);
    showError('預約失敗，請稍後再試。');
  } finally {
    isLoading.value = false; // 結束載入
  }
}

// 加入日曆功能 (Placeholder)
async function addToCalendar() {
  isLoading.value = true; // 開始載入
  try {
    await new Promise(resolve => setTimeout(resolve, 500)); // 模擬延遲
    showInfo('此功能將在未來版本中實現，可將預約添加到您的日曆。'); // 使用通知
  } catch (error) {
    console.error('加入日曆失敗:', error);
    showError('加入日曆失敗，請稍後再試。');
  } finally {
    isLoading.value = false; // 結束載入
  }
}
</script>

<style scoped>
/* 這裡可以放置 BookingFlow 特有的樣式，但盡量使用 Tailwind CSS */
</style>
