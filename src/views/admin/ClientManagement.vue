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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // 引入 useRouter
import { useNotification } from '../../composables/useNotification';

const clients = ref([
  { id: 1, name: '陳小姐', email: 'chen@email.com', phone: '0911111111' },
  { id: 2, name: '林先生', email: 'lin@email.com', phone: '0922222222' },
  { id: 3, name: '王小姐', email: 'wang@email.com', phone: '0933333333' },
  { id: 4, name: '張先生', email: 'zhang@email.com', phone: '0944444444' },
]);

const searchQuery = ref('');
// const isLoading = ref(false); // 移除 isLoading 狀態，因為導航是同步的
const { showSuccess, showError } = useNotification();

const router = useRouter(); // 使用 useRouter

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
  // isLoading.value = true; // 移除 isLoading 狀態
  console.log('導向客戶詳情:', clientId);
  router.push({ name: 'ClientDetail', params: { id: clientId } }); // 導向客戶詳情頁面
  // showSuccess(`正在導向客戶 ID: ${clientId} 的詳情頁面。`); // 導航成功後不需要額外提示
  // isLoading.value = false; // 移除 isLoading 狀態
}
</script>

<style scoped>
/* 移除舊有 CSS，完全使用 Tailwind */
</style>
