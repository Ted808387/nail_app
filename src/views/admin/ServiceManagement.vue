<template>
  <div class="min-h-screen bg-soft-blue-50 p-8">
    <h1 class="text-4xl font-bold text-soft-blue-800 text-center mb-10">服務項目管理</h1>

    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-soft-blue-200">
      <button @click="showModal(null)"
        class="px-6 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 mb-6">
        新增服務項目
      </button>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-xl overflow-hidden">
          <thead class="bg-soft-blue-200">
            <tr>
              <th class="py-3 px-4 text-left text-soft-blue-800 font-semibold">服務名稱</th>
              <th class="py-3 px-4 text-left text-soft-blue-800 font-semibold">價格</th>
              <th class="py-3 px-4 text-left text-soft-blue-800 font-semibold">狀態</th>
              <th class="py-3 px-4 text-left text-soft-blue-800 font-semibold">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in services" :key="service.id" class="border-b border-soft-blue-100 last:border-b-0">
              <td class="py-3 px-4 text-soft-blue-700">{{ service.name }}</td>
              <td class="py-3 px-4 text-soft-blue-700">NT$ {{ service.price }}</td>
              <td class="py-3 px-4">
                <span :class="[service.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800']"
                  class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ service.isActive ? '上架中' : '已下架' }}
                </span>
              </td>
              <td class="py-3 px-4 flex space-x-2">
                <button @click="showModal(service)"
                  class="px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition duration-300">
                  編輯
                </button>
                <button @click="toggleStatus(service)"
                  :class="[service.isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600']"
                  class="px-4 py-2 text-white rounded-full text-sm transition duration-300">
                  {{ service.isActive ? '下架' : '上架' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 新增/編輯服務的 Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative border border-soft-blue-200">
          <button @click="isModalOpen = false" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold">&times;</button>
          <h2 class="text-3xl font-bold text-soft-blue-800 mb-6">{{ currentService.id ? '編輯' : '新增' }}服務</h2>
          <form @submit.prevent="saveService">
            <div class="mb-4">
              <label for="service-name" class="block text-soft-blue-700 text-sm font-bold mb-2">服務名稱</label>
              <input type="text" id="service-name" v-model="currentService.name" placeholder="服務名稱" required
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
            </div>
            <div class="mb-6">
              <label for="service-price" class="block text-soft-blue-700 text-sm font-bold mb-2">價格</label>
              <input type="number" id="service-price" v-model="currentService.price" placeholder="價格" required
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
            </div>
            <button type="submit"
              class="w-full bg-soft-blue-600 hover:bg-soft-blue-700 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300">
              儲存
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const services = ref([
  { id: 1, name: '手部光療', price: 1200, isActive: true },
  { id: 2, name: '日式嫁接睫毛', price: 1800, isActive: true },
  { id: 3, name: '頭皮護理', price: 900, isActive: false },
]);
const isModalOpen = ref(false);
const currentService = ref({});

function showModal(service) {
  currentService.value = service ? { ...service } : { id: null, name: '', price: null, isActive: true };
  isModalOpen.value = true;
}

function saveService() {
  if (currentService.value.id) {
    // 編輯現有服務
    const index = services.value.findIndex(s => s.id === currentService.value.id);
    if (index !== -1) {
      services.value[index] = { ...currentService.value };
    }
  } else {
    // 新增服務
    currentService.value.id = services.value.length > 0 ? Math.max(...services.value.map(s => s.id)) + 1 : 1;
    services.value.push({ ...currentService.value });
  }
  console.log('儲存服務:', currentService.value);
  isModalOpen.value = false;
}

function toggleStatus(service) {
  service.isActive = !service.isActive;
  console.log('更新狀態:', service);
}
</script>

<style scoped>
/* 移除舊有 CSS，完全使用 Tailwind */
</style>