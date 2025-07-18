<template>
  <div class="min-h-screen bg-soft-blue-50 p-4 sm:p-6 md:p-8">
    <h1 class="text-3xl sm:text-4xl font-bold text-soft-blue-800 text-center mb-8 sm:mb-10">客戶名單管理</h1>

    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-soft-blue-200">
      <input type="text" placeholder="搜尋客戶姓名或 Email" v-model="searchQuery"
        class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400 mb-6 sm:mb-8">

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-xl overflow-hidden">
          <thead class="bg-soft-blue-200">
            <tr>
              <th class="py-2 sm:py-3 px-3 sm:px-4 text-left text-soft-blue-800 font-semibold text-xs sm:text-sm">姓名</th>
              <th class="py-2 sm:py-3 px-3 sm:px-4 text-left text-soft-blue-800 font-semibold text-xs sm:text-sm">Email</th>
              <th class="py-2 sm:py-3 px-3 sm:px-4 text-left text-soft-blue-800 font-semibold text-xs sm:text-sm">聯絡電話</th>
              <th class="py-2 sm:py-3 px-3 sm:px-4 text-left text-soft-blue-800 font-semibold text-xs sm:text-sm">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in filteredClients" :key="client.id" class="border-b border-soft-blue-100 last:border-b-0">
              <td class="py-2 sm:py-3 px-3 sm:px-4 text-soft-blue-700 text-xs sm:text-sm">{{ client.name }}</td>
              <td class="py-2 sm:py-3 px-3 sm:px-4 text-soft-blue-700 text-xs sm:text-sm">{{ client.email }}</td>
              <td class="py-2 sm:py-3 px-3 sm:px-4 text-soft-blue-700 text-xs sm:text-sm">{{ client.phone_number }}</td>
              <td class="py-2 sm:py-3 px-3 sm:px-4">
                <button @click="viewClientDetails(client)"
                  class="px-3 py-1 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 transition duration-300">
                  查看詳情
                </button>
              </td>
            </tr>
            <tr v-if="clientStore.clients.length === 0">
              <td colspan="4" class="py-6 sm:py-8 text-center text-soft-blue-600 text-base sm:text-lg">目前沒有客戶資料。</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 客戶詳情 Modal -->
    <div v-if="isModalOpen && selectedClient" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg relative border border-soft-blue-200">
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl font-bold">&times;</button>
        <h2 class="text-2xl sm:text-3xl font-bold text-soft-blue-800 mb-5 sm:mb-6">客戶詳情</h2>
        <div v-if="selectedClient" class="space-y-4">
          <p class="text-soft-blue-700 text-base sm:text-lg"><strong>姓名:</strong>
            <span v-if="!isEditing">{{ selectedClient.name }}</span>
            <input v-else type="text" v-model="selectedClient.name" class="p-2 border rounded-md w-full mt-1 text-sm sm:text-base">
          </p>
          <p class="text-soft-blue-700 text-base sm:text-lg"><strong>Email:</strong>
            <span v-if="!isEditing">{{ selectedClient.email }}</span>
            <input v-else type="email" v-model="selectedClient.email" class="p-2 border rounded-md w-full mt-1 text-sm sm:text-base">
          </p>
          <p class="text-soft-blue-700 text-base sm:text-lg"><strong>聯絡電話:</strong>
            <span v-if="!isEditing">{{ selectedClient.phone_number }}</span>
            <input v-else type="tel" v-model="selectedClient.phone_number" class="p-2 border rounded-md w-full mt-1 text-sm sm:text-base">
          </p>
          <p class="text-soft-blue-700 text-base sm:text-lg"><strong>註冊日期:</strong> {{ selectedClient.registration_date }}</p>
          <p class="text-soft-blue-700 text-base sm:text-lg"><strong>總預約次數:</strong> {{ selectedClient.totalBookings }}</p>
          <p class="text-soft-blue-700 text-base sm:text-lg"><strong>上次預約:</strong> {{ selectedClient.lastBookingDate }}</p>

          <div class="mt-6 sm:mt-8 flex justify-end space-x-4">
            <button v-if="!isEditing" @click="startEditing" :disabled="clientStore.isLoading"
              class="px-6 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              編輯
            </button>
            <template v-else>
              <button @click="saveChanges" :disabled="clientStore.isLoading"
                class="px-6 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ clientStore.isLoading ? '儲存中...' : '儲存' }}
              </button>
              <button @click="cancelEditing" :disabled="clientStore.isLoading"
                class="px-6 py-2 bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                取消
              </button>
            </template>
          </div>
        </div>
        <div v-else class="text-center text-soft-blue-600 text-base sm:text-lg py-8">
          載入客戶詳情中...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNotification } from '../../composables/useNotification';
import { useClientStore } from '../../stores/client'; // 引入 useClientStore

const clientStore = useClientStore(); // 使用 clientStore

const searchQuery = ref('');
const isModalOpen = ref(false); // 控制 Modal 開關
const selectedClient = ref(null); // 儲存選中的客戶資料
const isEditing = ref(false); // 控制編輯模式
const originalClient = ref(null); // 儲存原始客戶資料，用於取消編輯
const { showSuccess, showError } = useNotification();

// 組件掛載時載入數據
onMounted(async () => {
  try {
    await clientStore.fetchClients();
  } catch (error) {
    console.error('載入客戶失敗:', error);
    showError(clientStore.error || '載入客戶失敗，請稍後再試。');
  }
});

const filteredClients = computed(() => {
  if (!searchQuery.value) {
    return clientStore.clients; // 從 store 獲取客戶數據
  }
  const query = searchQuery.value.toLowerCase();
  return clientStore.clients.filter(client =>
    client.name.toLowerCase().includes(query) ||
    client.email.toLowerCase().includes(query)
  );
});

function startEditing() {
  isEditing.value = true;
  originalClient.value = { ...selectedClient.value }; // 儲存原始數據
}

async function saveChanges() {
  try {
    const updatedClientData = {
      id: selectedClient.value.id,
      name: selectedClient.value.name,
      phone_number: selectedClient.value.phone_number,
      // email 不可修改，所以不傳遞
    };
    await clientStore.updateClient(updatedClientData); // 調用 Pinia Store 的 action
    showSuccess('客戶資料已成功更新！');
    isEditing.value = false;
    originalClient.value = null; // 清空原始數據
  } catch (error) {
    console.error('更新客戶詳情失敗:', error);
    showError(clientStore.error || '更新客戶詳情失敗，請稍後再試。');
  }
}

function cancelEditing() {
  selectedClient.value = { ...originalClient.value }; // 恢復原始數據
  isEditing.value = false;
  originalClient.value = null; // 清空原始數據
}

function viewClientDetails(client) {
  selectedClient.value = { ...client }; // 複製一份，避免直接修改列表中的數據
  isModalOpen.value = true;
  isEditing.value = false; // 預設為非編輯模式
}

function closeModal() {
  isModalOpen.value = false;
  selectedClient.value = null;
  isEditing.value = false; // 關閉時重置編輯模式
  originalClient.value = null; // 關閉時清空原始數據
}
</script>

<style scoped>
/* 移除舊有 CSS，完全使用 Tailwind */
</style>