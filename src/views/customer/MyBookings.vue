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
          <p><strong>預約編號：</strong> {{ selectedBooking.id }}</p>
          <p><strong>服務項目：</strong> {{ selectedBooking.serviceName }}</p>
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
          <button v-if="!isEditing && isAdmin" @click="startEditing" :disabled="isLoading"
            class="px-5 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            編輯
          </button>
          <template v-else-if="isEditing && isAdmin">
            <button @click="saveChanges" :disabled="isLoading"
              class="px-5 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLoading ? '儲存中...' : '儲存' }}
            </button>
            <button @click="cancelEditing" :disabled="isLoading"
              class="px-5 py-2 bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              取消
            </button>
          </template>
          <button @click="closeModal" class="px-5 py-2 bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 transition duration-300">
            關閉
          </button>
          <button v-if="isUpcoming(selectedBooking) && !isEditing" @click="confirmCancel(selectedBooking.id)" :disabled="isLoading"
            class="px-5 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition duration-300 disabled:opacity-50">
            {{ isLoading ? '取消中...' : '取消預約' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNotification } from '../../composables/useNotification';
import { fetchBookings, saveBooking } from '../../api'; // 引入 API 函數
import { useAuth } from '../../composables/useAuth'; // 引入 useAuth

const { isAdmin } = useAuth(); // 使用 useAuth

const bookings = ref([]); // 初始化為空陣列
const isLoading = ref(false); // 新增載入狀態
const isModalOpen = ref(false); // 新增：控制 Modal 開關
const selectedBooking = ref(null); // 新增：儲存選中的預約詳情
const isEditing = ref(false); // 新增：控制編輯模式
const originalBooking = ref(null); // 新增：儲存原始數據，以便取消編輯時恢復
const { showSuccess, showError } = useNotification(); // 使用通知組合式函數

// 組件掛載時載入數據
onMounted(async () => {
  try {
    bookings.value = await fetchBookings(); // 從 API 載入預約數據
  } catch (error) {
    console.error('載入預約失敗:', error);
    showError('載入預約失敗，請稍後再試。');
  }
});

const upcomingBookings = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookings.value.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate >= today && booking.status !== 'cancelled' && booking.status !== 'completed';
  });
});

const pastBookings = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookings.value.filter(booking => {
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
  isLoading.value = true;
  try {
    // 模擬 API 呼叫
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = bookings.value.findIndex(b => b.id === selectedBooking.value.id);
    if (index !== -1) {
      // 只更新備註欄位
      const updatedBooking = { ...bookings.value[index], notes: selectedBooking.value.notes };
      await saveBooking(updatedBooking); // 調用 API 函數
      bookings.value[index] = updatedBooking; // 更新本地狀態
      showSuccess('預約備註已成功更新！');
      isEditing.value = false;
      originalBooking.value = null; // 清空原始數據
    } else {
      showError('更新失敗，找不到該預約。');
    }
  } catch (error) {
    console.error('儲存變更失敗:', error);
    showError('儲存變更失敗，請稍後再試。');
  } finally {
    isLoading.value = false;
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
  isLoading.value = true; // 開始載入
  console.log('嘗試取消預約:', bookingId);
  try {
    const index = bookings.value.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      const updatedBooking = { ...bookings.value[index], status: 'cancelled' };
      await saveBooking(updatedBooking); // 調用 API 函數
      bookings.value[index].status = 'cancelled'; // 更新本地狀態
      showSuccess('預約已成功取消！'); // 使用通知
    } else {
      showError('取消失敗，找不到該預約。'); // 使用通知
    }
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