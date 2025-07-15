<template>
  <div class="min-h-screen bg-soft-blue-50 p-4 sm:p-6 md:p-8">
    <h1 class="text-3xl sm:text-4xl font-bold text-soft-blue-800 text-center mb-8 sm:mb-10">預約詳情</h1>

    <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-soft-blue-200">
      <div v-if="booking" class="space-y-4">
        <p class="text-soft-blue-700 text-base sm:text-lg"><strong>預約 ID:</strong> {{ booking.id }}</p>
        <p class="text-soft-blue-700 text-base sm:text-lg"><strong>客戶姓名:</strong> {{ booking.clientName }}</p>
        <p class="text-soft-blue-700 text-base sm:text-lg"><strong>服務項目:</strong> {{ booking.serviceName }}</p>
        <p class="text-soft-blue-700 text-base sm:text-lg"><strong>日期:</strong> {{ booking.date }}</p>
        <p class="text-soft-blue-700 text-base sm:text-lg"><strong>時間:</strong> {{ booking.time }}</p>
        <p class="text-soft-blue-700 text-base sm:text-lg"><strong>狀態:</strong> 
          <span :class="['px-2 py-0.5 rounded-full text-sm font-medium', getBookingStatusClass(booking.status)]">
            {{ getBookingStatusText(booking.status) }}
          </span>
        </p>
        <p v-if="booking.notes" class="text-soft-blue-700 text-base sm:text-lg"><strong>備註:</strong> {{ booking.notes }}</p>

        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mt-8 mb-4">編輯預約狀態</h2>
        <form @submit.prevent="updateBookingStatus">
          <div class="mb-6">
            <label for="status" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2">狀態</label>
            <select id="status" v-model="editableBookingStatus"
              class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
              <option value="confirmed">已確認</option>
              <option value="pending">待處理</option>
              <option value="cancelled">已取消</option>
              <option value="completed">已完成</option>
            </select>
          </div>
          <button type="submit" :disabled="isLoading"
            class="w-full bg-soft-blue-600 hover:bg-soft-blue-700 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? '更新中...' : '更新狀態' }}
          </button>
        </form>
      </div>
      <div v-else class="text-center text-soft-blue-600 text-base sm:text-lg py-8">
        載入預約詳情中...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNotification } from '../../composables/useNotification';
import { loadBookings, saveBookings } from '../../services/dataService';

const route = useRoute();
const { showSuccess, showError } = useNotification();

const booking = ref(null);
const editableBookingStatus = ref('');
const isLoading = ref(false);

onMounted(async () => {
  const bookingId = parseInt(route.params.id);
  if (isNaN(bookingId)) {
    showError('無效的預約 ID。');
    return;
  }

  isLoading.value = true;
  try {
    const allBookings = loadBookings();
    const foundBooking = allBookings.find(b => b.id === bookingId);
    if (foundBooking) {
      booking.value = { ...foundBooking };
      editableBookingStatus.value = foundBooking.status;
    } else {
      showError('找不到該預約。');
    }
  } catch (error) {
    console.error('載入預約詳情失敗:', error);
    showError('載入預約詳情失敗，請稍後再試。');
  } finally {
    isLoading.value = false;
  }
});

function getBookingStatusClass(status) {
  switch (status) {
    case 'confirmed': return 'bg-green-200 text-green-800';
    case 'pending': return 'bg-orange-200 text-orange-800';
    case 'cancelled': return 'bg-red-200 text-red-800';
    case 'completed': return 'bg-blue-200 text-blue-800';
    default: return 'bg-gray-200 text-gray-800';
  }
}

function getBookingStatusText(status) {
  switch (status) {
    case 'confirmed': return '已確認';
    case 'pending': return '待處理';
    case 'cancelled': return '已取消';
    case 'completed': return '已完成';
    default: return '未知';
  }
}

async function updateBookingStatus() {
  isLoading.value = true;
  console.log('更新預約狀態:', booking.value.id, editableBookingStatus.value);
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const allBookings = loadBookings();
    const index = allBookings.findIndex(b => b.id === booking.value.id);
    if (index !== -1) {
      allBookings[index].status = editableBookingStatus.value;
      saveBookings(allBookings);
      booking.value.status = editableBookingStatus.value; // 更新顯示的狀態
      showSuccess('預約狀態已成功更新！');
    } else {
      showError('更新失敗，找不到該預約。');
    }
  } catch (error) {
    console.error('更新預約狀態失敗:', error);
    showError('更新預約狀態失敗，請稍後再試。');
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* 這裡可以放置 BookingDetail 特有的樣式，但盡量使用 Tailwind CSS */
</style>
