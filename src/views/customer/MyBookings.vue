<template>
  <div class="min-h-screen bg-soft-blue-50 p-4 sm:p-6 md:p-8">
    <h1 class="text-3xl sm:text-4xl font-bold text-soft-blue-800 text-center mb-8 sm:mb-10">我的預約紀錄</h1>

    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 mb-6 sm:mb-8 border border-soft-blue-200">
      <section class="upcoming-bookings mb-8 sm:mb-10">
        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mb-5 sm:mb-6">即將到來的預約</h2>
        <div v-if="upcomingBookings.length === 0" class="text-soft-blue-600 text-base sm:text-lg text-center py-6 sm:py-8">
          目前沒有即將到來的預約。
        </div>
        <div class="booking-card bg-soft-blue-100 p-4 sm:p-6 rounded-xl shadow-md mb-3 sm:mb-4 border border-soft-blue-200 cursor-pointer hover:shadow-lg hover:border-soft-blue-300 transition-all duration-300"
          v-for="booking in upcomingBookings" :key="booking.id" @click="showBookingDetails(booking)">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div class="flex-grow mb-3 md:mb-0">
              <p class="text-lg sm:text-xl font-bold text-soft-blue-800 mb-1">服務：{{ booking.serviceName }}</p>
              <p class="text-sm sm:text-base text-soft-blue-700 mb-1">日期：{{ booking.date }}</p>
              <p class="text-sm sm:text-base text-soft-blue-700 mb-1">時間：{{ booking.time }}</p>
              <p :class="['text-xs sm:text-sm font-semibold', getStatusClass(booking.status)]">
                狀態：{{ getStatusText(booking.status) }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="past-bookings">
        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mb-5 sm:mb-6">歷史預約紀錄</h2>
        <div v-if="pastBookings.length === 0" class="text-soft-blue-600 text-base sm:text-lg text-center py-6 sm:py-8">
          沒有歷史預約紀錄。
        </div>
        <div class="booking-card bg-gray-100 p-4 sm:p-6 rounded-xl shadow-md mb-3 sm:mb-4 border border-gray-200 cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all duration-300"
          v-for="booking in pastBookings" :key="booking.id" @click="showBookingDetails(booking)">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div class="flex-grow mb-3 md:mb-0">
              <p class="text-lg sm:text-xl font-bold text-gray-800 mb-1">服務：{{ booking.serviceName }}</p>
              <p class="text-sm sm:text-base text-gray-700 mb-1">日期：{{ booking.date }}</p>
              <p class="text-sm sm:text-base text-gray-700 mb-1">時間：{{ booking.time }}</p>
              <p :class="['text-xs sm:text-sm font-semibold', getStatusClass(booking.status)]">
                狀態：{{ getStatusText(booking.status) }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 預約詳情 Modal -->
    <div v-if="isModalOpen && selectedBooking" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg relative border border-soft-blue-200">
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl font-bold">&times;</button>
        <h2 class="text-2xl sm:text-3xl font-bold text-soft-blue-800 mb-5 sm:mb-6">預約詳情</h2>
        <div class="space-y-3 text-base sm:text-lg text-soft-blue-700">
          <p><strong>預約編號：</strong> {{ selectedBooking.booking_reference_id }}</p>
          <p><strong>服務項目：：</strong> {{ selectedBooking.serviceName }}</p>
          <p><strong>預約日期：</strong> {{ selectedBooking.date }}</p>
          <p><strong>預約時間：</strong> {{ selectedBooking.time }}</p>
          <p><strong>狀態：</strong> <span :class="getStatusClass(selectedBooking.status)">{{ getStatusText(selectedBooking.status) }}</span></p>
          <p><strong>總時長：</strong> {{ selectedBooking.totalDuration }} 分鐘</p>
          <p><strong>備註：</strong>
            <span v-if="!isEditing">{{ selectedBooking.notes || '無' }}</span>
            <textarea v-else v-model="selectedBooking.notes" rows="3" class="p-2 border rounded-md w-full mt-1 text-sm sm:text-base" placeholder="請輸入備註" :disabled="!isAdmin"></textarea>
          </p>
        </div>
        <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button v-if="!isEditing && isAdmin" @click="startEditing" :disabled="bookingStore.isLoading"
            class="px-5 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            編輯
          </button>
          <template v-else-if="isEditing && isAdmin">
            <button @click="saveChanges" :disabled="bookingStore.isLoading"
              class="px-5 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ bookingStore.isLoading ? '儲存中...' : '儲存' }}
            </button>
            <button @click="cancelEditing" :disabled="bookingStore.isLoading"
              class="px-5 py-2 bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              取消
            </button>
          </template>
          <button @click="closeModal" class="px-5 py-2 bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 transition duration-300">
            關閉
          </button>
          <button v-if="isUpcoming(selectedBooking) && !isEditing" @click="confirmCancel(selectedBooking.id)" :disabled="bookingStore.isLoading"
            class="px-5 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition duration-300 disabled:opacity-50">
            {{ bookingStore.isLoading ? '取消中...' : '取消預約' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNotification } from '../../composables/useNotification';
import { useAuthStore } from '../../stores/auth'; // 引入 useAuthStore
import { useBookingStore } from '../../stores/booking'; // 引入 useBookingStore

const authStore = useAuthStore(); // 使用 authStore
const bookingStore = useBookingStore(); // 使用 bookingStore

const isAdmin = computed(() => authStore.isAdmin); // 從 authStore 獲取 isAdmin

const isModalOpen = ref(false); // 控制 Modal 開關
const selectedBooking = ref(null); // 儲存選中的預約詳情
const isEditing = ref(false); // 控制編輯模式
const originalBooking = ref(null); // 儲存原始數據，以便取消編輯時恢復
const { showSuccess, showError } = useNotification(); // 使用通知組合式函數

// 組件掛載時載入數據
onMounted(async () => {
  try {
    await bookingStore.fetchMyBookings(); // 從 Pinia Store 載入預約數據
  } catch (error) {
    console.error('載入預約失敗:', error);
    showError('載入預約失敗，請稍後再試。');
  }
});

const upcomingBookings = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookingStore.bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate >= today && booking.status !== 'cancelled' && booking.status !== 'completed';
  });
});

const pastBookings = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookingStore.bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate < today || booking.status === 'cancelled' || booking.status === 'completed';
  });
});

function showBookingDetails(booking) {
  selectedBooking.value = booking;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  selectedBooking.value = null;
  isEditing.value = false; // 關閉 Modal 時重置編輯狀態
  originalBooking.value = null; // 清空原始數據
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '待處理',
    confirmed: '已確認',
    cancelled: '已取消',
    completed: '已完成'
  };
  return statusMap[status] || '未知';
};

const getStatusClass = (status) => {
  const classMap = {
    pending: 'text-orange-600',
    confirmed: 'text-green-600',
    cancelled: 'text-red-600',
    completed: 'text-blue-600'
  };
  return classMap[status] || 'text-gray-600';
};

const isUpcoming = (booking) => {
  return upcomingBookings.value.some(b => b.id === booking.id);
};

function startEditing() {
  isEditing.value = true;
  originalBooking.value = { ...selectedBooking.value }; // 儲存當前狀態以便取消時恢復
}

async function saveChanges() {
  try {
    const updatedBookingData = {
      notes: selectedBooking.value.notes,
    };
    await bookingStore.updateBooking(selectedBooking.value.id, updatedBookingData); // 調用 Pinia Store 的 updateBooking action
    showSuccess('預約備註已成功更新！');
    isEditing.value = false;
    originalBooking.value = null; // 清空原始數據
    // 不需要重新載入，Pinia Store 會自動更新
  } catch (error) {
    console.error('儲存變更失敗:', error);
    showError(bookingStore.error || '儲存變更失敗，請稍後再試。');
  }
}

function cancelEditing() {
  selectedBooking.value = { ...originalBooking.value }; // 恢復原始數據
  isEditing.value = false;
  originalBooking.value = null; // 清空原始數據
}

function confirmCancel(bookingId) {
  if (confirm('您確定要取消這次的預約嗎？\n\n取消規則：預約前24小時內不可取消，否則可能產生費用。')) {
    cancelBooking(bookingId);
  }
}

async function cancelBooking(bookingId) {
  console.log('嘗試取消預約:', bookingId);
  try {
    await bookingStore.updateBooking(bookingId, { status: 'cancelled' }); // 調用 Pinia Store 的 updateBooking action
    showSuccess('預約已成功取消！'); // 使用通知
    closeModal(); // 取消後關閉模態框
  } catch (error) {
    console.error('取消預約失敗:', error);
    showError(bookingStore.error || '取消預約失敗，請稍後再試。'); // 使用通知
  }
}
</script>

<style scoped>
/* 這裡可以放置 MyBookings 特有的樣式，但盡量使用 Tailwind CSS */
</style>