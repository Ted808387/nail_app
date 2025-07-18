import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchMyBookings as apiFetchMyBookings, fetchAllBookings as apiFetchAllBookings, saveBooking as apiSaveBooking, updateBooking as apiUpdateBooking, deleteBooking as apiDeleteBooking } from '../api';
import { useNotification } from '../composables/useNotification';
import { useAuthStore } from './auth'; // 引入 auth store 以獲取 isAdmin 狀態

export const useBookingStore = defineStore('booking', () => {
  const bookings = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const { showSuccess, showError } = useNotification();
  const authStore = useAuthStore();

  async function fetchBookings() {
    isLoading.value = true;
    error.value = null;
    try {
      let fetchedBookings;
      if (authStore.isAdmin) {
        fetchedBookings = await apiFetchAllBookings();
      } else {
        fetchedBookings = await apiFetchMyBookings();
      }
      bookings.value = fetchedBookings;
      showSuccess('預約資料載入成功！');
    } catch (err) {
      error.value = err;
      showError('載入預約資料失敗！');
      console.error('Error fetching bookings:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function saveBooking(bookingData) {
    isLoading.value = true;
    error.value = null;
    try {
      const newBooking = await apiSaveBooking(bookingData);
      // 根據實際後端返回的數據，可能需要更新 bookings 列表
      // 這裡假設後端返回的是完整的預約對象
      // 如果是新增，則添加到列表；如果是更新，則替換現有對象
      const index = bookings.value.findIndex(b => b.id === newBooking.id);
      if (index !== -1) {
        bookings.value[index] = newBooking;
      } else {
        bookings.value.push(newBooking);
      }
      showSuccess('預約已成功儲存！');
      return newBooking;
    } catch (err) {
      error.value = err;
      showError('儲存預約失敗！');
      console.error('Error saving booking:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateBooking(bookingId, bookingData) {
    isLoading.value = true;
    error.value = null;
    try {
      const updatedBooking = await apiUpdateBooking(bookingId, bookingData);
      const index = bookings.value.findIndex(b => b.id === updatedBooking.id);
      if (index !== -1) {
        bookings.value[index] = updatedBooking;
      }
      showSuccess('預約已成功更新！');
      return updatedBooking;
    } catch (err) {
      error.value = err;
      showError('更新預約失敗！');
      console.error('Error updating booking:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteBooking(bookingId) {
    isLoading.value = true;
    error.value = null;
    try {
      await apiDeleteBooking(bookingId);
      bookings.value = bookings.value.filter(b => b.id !== bookingId);
      showSuccess('預約已成功刪除！');
    } catch (err) {
      error.value = err;
      showError('刪除預約失敗！');
      console.error('Error deleting booking:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    bookings,
    isLoading,
    error,
    fetchBookings,
    saveBooking,
    updateBooking,
    deleteBooking,
  };
});