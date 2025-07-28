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
          <div v-for="service in serviceStore.services" :key="service.id"
            :class="['bg-soft-blue-50 p-4 sm:p-6 rounded-xl shadow-md border cursor-pointer transition duration-300', selectedServiceIds.includes(service.id) ? 'border-soft-blue-600 ring-2 ring-soft-blue-500' : 'border-soft-blue-200 hover:border-soft-blue-400']"
            @click="toggleService(service.id)">
            <h3 class="text-xl sm:text-2xl font-semibold text-soft-blue-800 mb-1">{{ service.name }}</h3>
            <p class="text-sm sm:text-base text-soft-blue-600 mb-2">{{ service.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-base sm:text-lg font-medium text-soft-blue-700">NT$ {{ service.price }}</span>
              <span class="text-xs sm:text-sm text-soft-blue-500">{{ service.min_duration }} - {{ service.max_duration }} 分鐘</span>
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
          <CustomerCalendar
            v-if="!businessSettingsStore.isLoading && !bookingStore.isLoading"
            v-model:selectedDate="selectedDate"
            :is-date-bookable="isDateBookable"
          />
          <p v-if="errors.date" class="text-red-500 text-sm mb-3 sm:mb-4">{{ errors.date }}</p>

          <p class="text-base sm:text-lg font-semibold text-soft-blue-600 mb-3 sm:mb-4">請選擇預約時間 (預計服務時長: {{ totalDuration }} 分鐘)：</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            <button v-for="slot in filteredAvailableTimes" :key="slot.time"
              :class="[
                'p-2 sm:p-3 rounded-lg text-center transition duration-200 text-sm sm:text-base',
                slot.isBooked
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : selectedTime === slot.time
                    ? 'bg-soft-blue-600 text-white'
                    : 'bg-soft-blue-200 text-soft-blue-800 hover:bg-soft-blue-300'
              ]"
              :disabled="slot.isBooked"
              @click="selectedTime = slot.time">
              {{ slot.time }} {{ slot.isBooked ? '(已預約)' : '' }}
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
              {{ service.name }} ({{ service.min_duration }} - {{ service.max_duration }} 分鐘, NT$ {{ service.price }})
            </li>
          </ul>
          <p><strong>預約日期：</strong> {{ selectedDate }}</p>
          <p><strong>預約時間：</strong> {{ selectedTime }}</p>
          <p><strong>總價格：</strong> NT$ {{ totalPrice }}</p>
          <p><strong>姓名：</strong> <input type="text" v-model="customerName" class="p-2 border rounded-md w-full mt-1 text-sm sm:text-base" placeholder="請輸入您的姓名"></p>
          <p><strong>Email：</strong> <input type="email" v-model="customerEmail" class="p-2 border rounded-md w-full mt-1 text-sm sm:text-base" placeholder="請輸入您的 Email"></p>
          <p><strong>電話：</strong> <input type="tel" v-model="customerPhone" class="p-2 border rounded-md w-full mt-1 text-sm sm:text-base" placeholder="請輸入您的電話"></p>
          <p><strong>備註 (選填)：：</strong> <textarea v-model="bookingNotes" rows="3" class="p-2 border rounded-md w-full mt-1 text-sm sm:text-base" placeholder="如有其他需求或備註，請在此填寫"></textarea></p>
          <p v-if="errors.customerInfo" class="text-red-500 text-sm">{{ errors.customerInfo }}</p>
        </div>
        <div class="flex justify-between mt-6 sm:mt-8">
          <button @click="goToStep(2)"
            class="px-5 sm:px-6 py-2 sm:py-3 bg-gray-300 text-gray-800 text-base sm:text-lg font-semibold rounded-full shadow-md hover:bg-gray-400 transition duration-300">
            上一步
          </button>
          <button @click="confirmBooking" :disabled="bookingStore.isLoading"
            class="px-6 sm:px-8 py-2 sm:py-3 bg-soft-blue-600 text-white text-base sm:text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ bookingStore.isLoading ? '送出中...' : '確認送出' }}
          </button>
        </div>
      </div>

      <!-- 步驟四: 預約成功 -->
      <div v-if="currentStep === 4" class="text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-soft-blue-800 mb-4 sm:mb-6">🎉 預約成功！</h2>
        <p class="text-lg sm:text-xl text-soft-blue-700 mb-3 sm:mb-4">我們已經收到您的預約，期待您的光臨。</p>
        <p class="text-xl sm:text-2xl font-bold text-soft-blue-900 mb-6 sm:mb-8">您的預約編號：{{ bookingId }}</p>
        <div class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <router-link v-if="authStore.isLoggedIn" to="/my-bookings"
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
import CustomerCalendar from '../../components/CustomerCalendar.vue';
import { useAuthStore } from '../../stores/auth';
import { useBookingStore } from '../../stores/booking';
import { useServiceStore } from '../../stores/service';
import { useBusinessSettingsStore } from '../../stores/businessSettings';
import api from '../../api';

const route = useRoute();
const router = useRouter();
const { showSuccess, showError, showInfo } = useNotification();

const authStore = useAuthStore();
const bookingStore = useBookingStore();
const serviceStore = useServiceStore();
const businessSettingsStore = useBusinessSettingsStore();

const currentStep = ref(1);
const selectedServiceIds = ref([]);
const selectedDate = ref('');
const selectedTime = ref('');
const customerName = ref('');
const customerEmail = ref('');
const customerPhone = ref('');
const bookingNotes = ref('');
const bookingId = ref('');
const errors = ref({});
const isLoading = ref(false);

// 輔助函數：將 YYYY-MM-DD 格式的日期字串解析為本地時區的 Date 物件
function parseDateStringAsLocal(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

onMounted(async () => {
  try {
    const slug = route.params.slug; // 從路由參數中獲取 slug

    if (slug) {
      // 如果有 slug，則載入該店家的公開資料
      const publicProfile = await api.fetchPublicProfile(slug);
      // 將載入的資料更新到 Pinia Store 中
      serviceStore.setServices(publicProfile.services);
      businessSettingsStore.setBusinessHours(publicProfile.business_hours);
      businessSettingsStore.setHolidays(publicProfile.holidays);
      businessSettingsStore.setUnavailableDates(publicProfile.unavailable_dates);
      businessSettingsStore.setBookableTimeSlots(publicProfile.bookable_time_slots);
      localStorage.setItem('lastVisitedSlug', slug); // 儲存 slug 到 localStorage

      // 載入該店家的預約資料
      const publicBookings = await api.fetchPublicBookingsBySlug(slug);
      bookingStore.setBookings(publicBookings);

    } else {
      // 如果沒有 slug，則載入所有服務和設定 (舊行為)
      await Promise.all([
        serviceStore.fetchServices(),
        businessSettingsStore.fetchBusinessSettings(),
      ]);
      // 在沒有 slug 的情況下，仍然可以獲取所有預約（如果需要）
      await bookingStore.fetchAllBookings();
    }

    if (route.query.service) {
      const serviceId = parseInt(route.query.service);
      if (serviceStore.services.some(s => s.id === serviceId)) {
        selectedServiceIds.value.push(serviceId);
      }
    }
  } catch (error) {
    console.error('載入預約頁面數據失敗:', error);
    showError('載入頁面資料失敗，請稍後再試或聯繫客服。');
  } 
});

const totalDuration = computed(() => {
  return selectedServiceIds.value.reduce((sum, id) => {
    const service = serviceStore.services.find(s => s.id === id);
    return sum + (service ? service.max_duration : 0);
  }, 0);
});

const totalPrice = computed(() => {
  return selectedServiceIds.value.reduce((sum, id) => {
    const service = serviceStore.services.find(s => s.id === id);
    return sum + (service ? service.price : 0);
  }, 0);
});

const selectedServicesDetails = computed(() => {
  return selectedServiceIds.value.map(id => serviceStore.services.find(s => s.id === id)).filter(Boolean);
});

const isDateBookable = (dateString) => {
  const settings = businessSettingsStore.settings;
  const allBookings = bookingStore.bookings;

  if (!settings || !settings.business_hours || !settings.holidays || !settings.unavailable_dates || !allBookings) {
    return { isBookable: false, reason: 'unavailable' };
  }

  const { business_hours, holidays, unavailable_dates, bookable_time_slots } = settings;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = parseDateStringAsLocal(dateString);

  if (checkDate < today) {
    return { isBookable: false, reason: 'unavailable' };
  }

  if (holidays.some(h => h.date === dateString) || unavailable_dates.some(u => u.date === dateString)) {
    return { isBookable: false, reason: 'unavailable' };
  }

  const jsDayOfWeek = checkDate.getDay();
  const isoDayOfWeek = jsDayOfWeek === 0 ? 7 : jsDayOfWeek;
  const businessDay = business_hours.find(d => d.day_of_week === isoDayOfWeek);

  if (!businessDay || businessDay.is_closed) {
    return { isBookable: false, reason: 'unavailable' };
  }

  // 簡化邏輯：只檢查 30 分鐘的時段是否可用
  const durationToCheck = 30; 

  const timeSlots = (bookable_time_slots && bookable_time_slots.length > 0)
    ? bookable_time_slots
    : [{ start_time: businessDay.open_time, end_time: businessDay.close_time }];

  const bookingsForDay = allBookings.filter(b => b.date === dateString);

  for (const slot of timeSlots) {
    const slotStart = new Date(`${dateString}T${slot.start_time}`);
    const slotEnd = new Date(`${dateString}T${slot.end_time}`);
    let currentTime = new Date(slotStart);

    while (currentTime < slotEnd) {
      const startTime = new Date(currentTime);
      const endTime = new Date(startTime.getTime() + durationToCheck * 60000);

      if (endTime <= slotEnd) {
        let isOverlapped = false;
        for (const booking of bookingsForDay) {
          const bookingStart = new Date(`${booking.date}T${booking.time}`);
          const service = serviceStore.services.find(s => s.id === booking.service_id);
          const bookingDuration = service ? service.max_duration : 30; // 已預約的項目仍需考慮其時長
          const bookingEnd = new Date(bookingStart.getTime() + bookingDuration * 60000);

          if (startTime < bookingEnd && endTime > bookingStart) {
            isOverlapped = true;
            break;
          }
        }

        if (!isOverlapped) {
          return { isBookable: true, reason: null };
        }
      }
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
  }

  return { isBookable: false, reason: 'booked' };
};

const filteredAvailableTimes = computed(() => {
  if (!selectedDate.value) return [];

  const { isBookable } = isDateBookable(selectedDate.value);
  if (!isBookable) return [];

  const settings = businessSettingsStore.settings;
  const allBookings = bookingStore.bookings;
  const { business_hours, bookable_time_slots } = settings;

  const checkDate = parseDateStringAsLocal(selectedDate.value);
  const jsDayOfWeek = checkDate.getDay();
  const isoDayOfWeek = jsDayOfWeek === 0 ? 7 : jsDayOfWeek;
  const businessDay = business_hours.find(d => d.day_of_week === isoDayOfWeek);

  const times = [];
  const timeSlots = (bookable_time_slots && bookable_time_slots.length > 0)
    ? bookable_time_slots
    : [{ start_time: businessDay.open_time, end_time: businessDay.close_time }];

  timeSlots.forEach(slot => {
    const slotStart = new Date(`${selectedDate.value}T${slot.start_time}`);
    const slotEnd = new Date(`${selectedDate.value}T${slot.end_time}`);
    let currentTime = new Date(slotStart);

    while (currentTime < slotEnd) {
      times.push(currentTime.toTimeString().slice(0, 5));
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
  });

  const bookingsForDay = allBookings.filter(b => b.date === selectedDate.value);

  return times.map(time => {
    const startTime = new Date(`${selectedDate.value}T${time}`);
    // 簡化邏輯：只檢查 30 分鐘的時段是否被佔用
    const endTime = new Date(startTime.getTime() + 30 * 60000);

    let isBooked = false;
    for (const booking of bookingsForDay) {
      const bookingStart = new Date(`${booking.date}T${booking.time}`);
      const service = serviceStore.services.find(s => s.id === booking.service_id);
      const bookingDuration = service ? service.max_duration : 30; // 已預約的項目仍需考慮其時長
      const bookingEnd = new Date(bookingStart.getTime() + bookingDuration * 60000);

      if (startTime < bookingEnd && endTime > bookingStart) {
        isBooked = true;
        break;
      }
    }
    return { time, isBooked };
  });
});

function toggleService(serviceId) {
  const index = selectedServiceIds.value.indexOf(serviceId);
  if (index > -1) {
    selectedServiceIds.value.splice(index, 1);
  } else {
    selectedServiceIds.value.push(serviceId);
  }
}

function goToStep(step) {
  errors.value = {};
  if (step === 2) {
    if (selectedServiceIds.value.length === 0) {
      showError('請至少選擇一項服務。');
      errors.value.services = '請至少選擇一項服務。';
      return;
    }
  } else if (step === 3) {
    if (!selectedDate.value) {
      showError('請選擇預約日期。');
      errors.value.date = '請選擇預約日期。';
      return;
    }
    if (!selectedTime.value) {
      showError('請選擇預約時間。');
      errors.value.time = '請選擇預約時間。';
      return;
    }
  }
  currentStep.value = step;
}

async function confirmBooking() {
  errors.value = {};
  if (!customerName.value || !customerEmail.value || !customerPhone.value) {
    showError('請填寫完整的聯絡資訊。');
    errors.value.customerInfo = '請填寫完整的聯絡資訊。';
    return;
  }

  try {
    const newBookingData = {
      service_id: selectedServiceIds.value[0],
      date: selectedDate.value,
      time: selectedTime.value,
      status: 'pending',
      notes: bookingNotes.value === '' ? null : bookingNotes.value,
      customer_name: customerName.value,
      customer_email: customerEmail.value,
      customer_phone: customerPhone.value,
      // 如果用戶已登入，則傳遞 user_id
      ...(authStore.isLoggedIn && { user_id: authStore.currentUserId }),
      // 如果有 slug，則傳遞 public_slug
      ...(route.params.slug && { public_slug: route.params.slug }),
    };
    const savedBooking = await bookingStore.saveBooking(newBookingData);

    // 預約編號
    bookingId.value = savedBooking.booking_reference_id;

    showSuccess('預約成功！');
    currentStep.value = 4;
  } catch (error) {
    console.error('預約失敗:', error);
    showError(bookingStore.error || '預約失敗，請稍後再試。');
  }
}

async function addToCalendar() {
  isLoading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    showInfo('此功能將在未來版本中實現。');
  } catch (error) {
    console.error('加入日曆失敗:', error);
    showError('加入日曆失敗，請稍後再試。');
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* 這裡可以放置 BookingFlow 特有的樣式，但盡量使用 Tailwind CSS */
</style>
