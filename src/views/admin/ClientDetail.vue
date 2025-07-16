<template>
  <div class="min-h-screen bg-soft-blue-50 p-4 sm:p-6 md:p-8">
    <h1 class="text-3xl sm:text-4xl font-bold text-soft-blue-800 text-center mb-8 sm:mb-10">客戶詳情</h1>

    <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-soft-blue-200">
      <div v-if="client" class="space-y-4">
        <p class="text-soft-blue-700 text-base sm:text-lg"><strong>姓名:</strong> {{ client.name }}</p>
        <p class="text-soft-blue-700 text-base sm:text-lg"><strong>Email:</strong> {{ client.email }}</p>
        <p class="text-soft-blue-700 text-base sm:text-lg"><strong>聯絡電話:</strong> {{ client.phone }}</p>
        <p class="text-soft-blue-700 text-base sm:text-lg"><strong>註冊日期:</strong> {{ client.registrationDate }}</p>
        <p class="text-soft-blue-700 text-base sm:text-lg"><strong>總預約次數:</strong> {{ client.totalBookings }}</p>
        <p class="text-soft-blue-700 text-base sm:text-lg"><strong>上次預約:</strong> {{ client.lastBookingDate }}</p>

        <h2 class="text-2xl sm:text-3xl font-semibold text-soft-blue-700 mt-8 mb-4">編輯客戶資訊</h2>
        <form @submit.prevent="updateClientDetails">
          <div class="mb-4">
            <label for="edit-name" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2">姓名</label>
            <input type="text" id="edit-name" v-model="editableClient.name"
              class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          </div>
          <div class="mb-4">
            <label for="edit-email" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2">Email</label>
            <input type="email" id="edit-email" v-model="editableClient.email"
              class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          </div>
          <div class="mb-6">
            <label for="edit-phone" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2">聯絡電話</label>
            <input type="tel" id="edit-phone" v-model="editableClient.phone"
              class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          </div>
          <button type="submit" :disabled="isLoading"
            class="w-full bg-soft-blue-600 hover:bg-soft-blue-700 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? '儲存中...' : '儲存變更' }}
          </button>
        </form>
      </div>
      <div v-else class="text-center text-soft-blue-600 text-base sm:text-lg py-8">
        載入客戶詳情中...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNotification } from '../../composables/useNotification';
import { fetchClientById, updateClient } from '../../api'; // 引入 API 函數

const route = useRoute();
const { showSuccess, showError } = useNotification();

const client = ref(null);
const editableClient = ref({});
const isLoading = ref(false);

onMounted(async () => {
  const clientId = parseInt(route.params.id);
  if (isNaN(clientId)) {
    showError('無效的客戶 ID。');
    return;
  }

  isLoading.value = true;
  try {
    const foundClient = await fetchClientById(clientId); // 調用 API 函數
    if (foundClient) {
      client.value = { ...foundClient };
      editableClient.value = { ...foundClient }; // 複製一份用於編輯
    } else {
      showError('找不到該客戶。');
    }
  } catch (error) {
    console.error('載入客戶詳情失敗:', error);
    showError('載入客戶詳情失敗，請稍後再試。');
  } finally {
    isLoading.value = false;
  }
});

async function updateClientDetails() {
  isLoading.value = true;
  console.log('更新客戶詳情:', editableClient.value);
  try {
    const updatedClient = await updateClient(editableClient.value); // 調用 API 函數
    Object.assign(client.value, updatedClient); // 更新顯示的客戶數據
    showSuccess('客戶資料已成功更新！');
  } catch (error) {
    console.error('更新客戶詳情失敗:', error);
    showError('更新客戶詳情失敗，請稍後再試。');
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* 這裡可以放置 ClientDetail 特有的樣式，但盡量使用 Tailwind CSS */
</style>
