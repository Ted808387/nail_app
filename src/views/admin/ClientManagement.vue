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
              <td class="py-2 sm:py-3 px-3 sm:px-4 text-soft-blue-700 text-xs sm:text-sm">{{ client.phone }}</td>
              <td class="py-2 sm:py-3 px-3 sm:px-4">
                <button @click="viewClientDetails(client.id)"
                  class="px-3 py-1 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 transition duration-300">
                  查看詳情
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'; // 引入 onMounted
import { useRouter } from 'vue-router';
import { useNotification } from '../../composables/useNotification';
import { fetchClients } from '../../api'; // 引入 API 函數

const clients = ref([]); // 初始化為空陣列
const searchQuery = ref('');
// const isLoading = ref(false); // 移除 isLoading 狀態，因為導航是同步的
const { showSuccess, showError } = useNotification();

const router = useRouter();

// 組件掛載時載入數據
onMounted(async () => {
  try {
    clients.value = await fetchClients();
  } catch (error) {
    console.error('載入客戶失敗:', error);
    showError('載入客戶失敗，請稍後再試。');
  }
});

const filteredClients = computed(() => {
  if (!searchQuery.value) {
    return clients.value;
  }
  const query = searchQuery.value.toLowerCase();
  return clients.value.filter(client =>
    client.name.toLowerCase().includes(query) ||
    client.email.toLowerCase().includes(query)
  );
});

function viewClientDetails(clientId) {
  console.log('導向客戶詳情:', clientId);
  router.push({ name: 'ClientDetail', params: { id: clientId } }); // 導向客戶詳情頁面
}
</script>

<style scoped>
/* 移除舊有 CSS，完全使用 Tailwind */
</style>