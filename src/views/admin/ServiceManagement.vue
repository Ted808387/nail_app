<template>
  <div class="min-h-screen bg-soft-blue-50 p-4 sm:p-6 md:p-8">
    <h1 class="text-3xl sm:text-4xl font-bold text-soft-blue-800 text-center mb-8 sm:mb-10">服務項目管理</h1>

    <div class="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-soft-blue-200">
      <div class="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <button @click="showModal(null)"
          class="px-5 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 text-base sm:text-lg">
          新增服務項目
        </button>
        <div class="flex flex-col sm:flex-row gap-4">
          <select v-model="filterCategory" class="border border-soft-blue-300 rounded-xl py-2 px-3 text-sm">
            <option value="">所有類別</option>
            <option value="手部護理">手部護理</option>
            <option value="美睫">美睫</option>
            <option value="頭皮護理">頭皮護理</option>
            <option value="臉部護理">臉部護理</option>
            <option value="足部護理">足部護理</option>
          </select>
          <select v-model="filterStatus" class="border border-soft-blue-300 rounded-xl py-2 px-3 text-sm">
            <option value="">所有狀態</option>
            <option value="true">上架中</option>
            <option value="false">已下架</option>
          </select>
        </div>
        <div class="flex flex-wrap justify-center sm:justify-end gap-2">
          <button @click="bulkAction('activate')" :disabled="selectedServices.length === 0 || serviceStore.isLoading"
            class="px-3 py-1 bg-green-500 text-white rounded-full text-xs sm:text-sm hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ serviceStore.isLoading ? '處理中...' : '批量上架' }}
          </button>
          <button @click="bulkAction('deactivate')" :disabled="selectedServices.length === 0 || serviceStore.isLoading"
            class="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs sm:text-sm hover:bg-yellow-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ serviceStore.isLoading ? '處理中...' : '批量下架' }}
          </button>
          <button @click="bulkAction('delete')" :disabled="selectedServices.length === 0 || serviceStore.isLoading"
            class="px-3 py-1 bg-red-500 text-white rounded-full text-xs sm:text-sm hover:bg-red-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ serviceStore.isLoading ? '處理中...' : '批量刪除' }}
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-xl overflow-hidden">
          <thead class="bg-soft-blue-200">
            <tr>
              <th class="py-2 sm:py-3 px-3 sm:px-4 text-left text-soft-blue-800 font-semibold text-xs sm:text-sm">
                <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected">
              </th>
              <th class="py-2 sm:py-3 px-3 sm:px-4 text-left text-soft-blue-800 font-semibold text-xs sm:text-sm">圖片</th>
              <th class="py-2 sm:py-3 px-3 sm:px-4 text-left text-soft-blue-800 font-semibold text-xs sm:text-sm">服務名稱</th>
              <th class="py-2 sm:py-3 px-3 sm:px-4 text-left text-soft-blue-800 font-semibold text-xs sm:text-sm">類別</th>
              <th class="py-2 sm:py-3 px-3 sm:px-4 text-left text-soft-blue-800 font-semibold text-xs sm:text-sm">價格</th>
              <th class="py-2 sm:py-3 px-3 sm:px-4 text-left text-soft-blue-800 font-semibold text-xs sm:text-sm">時長範圍 (分)</th>
              <th class="py-2 sm:py-3 px-3 sm:px-4 text-left text-soft-blue-800 font-semibold text-xs sm:text-sm">狀態</th>
              <th class="py-2 sm:py-3 px-3 sm:px-4 text-left text-soft-blue-800 font-semibold text-xs sm:text-sm">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in filteredServices" :key="service.id" class="border-b border-soft-blue-100 last:border-b-0 hover:bg-soft-blue-50">
              <td class="py-2 sm:py-3 px-3 sm:px-4">
                <input type="checkbox" v-model="selectedServices" :value="service.id">
              </td>
              <td class="py-2 sm:py-3 px-3 sm:px-4">
                <img :src="service.image_url || 'https://via.placeholder.com/50?text=Service'" :alt="service.name"
                  class="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md">
              </td>
              <td class="py-2 sm:py-3 px-3 sm:px-4 text-soft-blue-700 text-xs sm:text-sm">{{ service.name }}</td>
              <td class="py-2 sm:py-3 px-3 sm:px-4 text-soft-blue-700 text-xs sm:text-sm">{{ service.category }}</td>
              <td class="py-2 sm:py-3 px-3 sm:px-4 text-soft-blue-700 text-xs sm:text-sm">NT$ {{ service.price }}</td>
              <td class="py-2 sm:py-3 px-3 sm:px-4 text-soft-blue-700 text-xs sm:text-sm">{{ service.min_duration }} - {{ service.max_duration }}</td>
              <td class="py-2 sm:py-3 px-3 sm:px-4">
                <span :class="[service.is_active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800']"
                  class="px-2 py-0.5 rounded-full text-xs font-medium">
                  {{ service.is_active ? '上架中' : '已下架' }}
                </span>
              </td>
              <td class="py-2 sm:py-3 px-3 sm:px-4 flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                <button @click="showModal(service)" :disabled="serviceStore.isLoading"
                  class="px-3 py-1 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  編輯
                </button>
                <button @click="toggleStatus(service)" :disabled="serviceStore.isLoading"
                  :class="[service.is_active ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600']"
                  class="px-3 py-1 text-white rounded-full text-xs transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ service.is_active ? '下架' : '上架' }}
                </button>
              </td>
            </tr>
            <tr v-if="serviceStore.services.length === 0">
              <td colspan="8" class="py-6 sm:py-8 text-center text-soft-blue-600 text-base sm:text-lg">目前沒有服務項目。</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 新增/編輯服務的 Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative border border-soft-blue-200">
          <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl font-bold">&times;</button>
          <h2 class="text-2xl sm:text-3xl font-bold text-soft-blue-800 mb-5 sm:mb-6">{{ currentService.id ? '編輯' : '新增' }}服務</h2>
          <form @submit.prevent="saveService">
            <div class="mb-3 sm:mb-4">
              <label for="service-name" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2">服務名稱 <span class="text-red-500">*</span></label>
              <input type="text" id="service-name" v-model="currentService.name" placeholder="服務名稱" required
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
            </div>
            <div class="mb-3 sm:mb-4">
              <label for="service-description" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2">描述</label>
              <textarea id="service-description" v-model="currentService.description" rows="3" placeholder="服務詳細描述"
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400"></textarea>
            </div>
            <div class="mb-3 sm:mb-4">
              <label for="service-category" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2">類別</label>
              <select id="service-category" v-model="currentService.category"
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
                <option value="">請選擇</option>
                <option value="手部護理">手部護理</option>
                <option value="美睫">美睫</option>
                <option value="頭皮護理">頭皮護理</option>
                <option value="臉部護理">臉部護理</option>
                <option value="足部護理">足部護理</option>
              </select>
            </div>
            <div class="mb-3 sm:mb-4">
              <label for="service-price" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2">價格 <span class="text-red-500">*</span></label>
              <input type="number" id="service-price" v-model="currentService.price" placeholder="價格" required
                class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
            </div>
            <div class="mb-3 sm:mb-4 flex space-x-4">
              <div class="flex-1">
                <label for="service-min-duration" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2">最短時長 (分鐘) <span class="text-red-500">*</span></label>
                <input type="number" id="service-min-duration" v-model="currentService.min_duration" placeholder="最短時長" required
                  class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
              </div>
              <div class="flex-1">
                <label for="service-max-duration" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2">最長時長 (分鐘) <span class="text-red-500">*</span></label>
                <input type="number" id="service-max-duration" v-model="currentService.max_duration" placeholder="最長時長" required
                  class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
              </div>
            </div>
            <div class="mb-5 sm:mb-6">
              <label class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2">服務圖片</label>
              <div class="mt-2 flex items-center space-x-4">
                <img :src="currentService.image_url || 'https://via.placeholder.com/100?text=Preview'"
                     alt="Service Image Preview"
                     class="w-24 h-24 object-cover rounded-lg border border-soft-blue-200">
                <input type="file" ref="imageInput" @change="handleImageUpload" accept="image/*" class="hidden">
                <button type="button" @click="triggerImageUpload" :disabled="serviceStore.isLoading"
                        class="px-4 py-2 bg-soft-blue-500 text-white rounded-full shadow-md hover:bg-soft-blue-600 transition duration-300 disabled:opacity-50">
                  {{ serviceStore.isLoading ? '上傳中...' : '選擇圖片' }}
                </button>
              </div>
            </div>
            <div class="mb-5 sm:mb-6 flex items-center">
              <input type="checkbox" id="service-active" v-model="currentService.is_active" class="mr-2 leading-tight h-4 w-4 text-soft-blue-600 focus:ring-soft-blue-500 border-gray-300 rounded">
              <label for="service-active" class="text-soft-blue-700 text-sm sm:text-base">上架</label>
            </div>
            <button type="submit" :disabled="serviceStore.isLoading"
              class="w-full bg-soft-blue-600 hover:bg-soft-blue-700 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ serviceStore.isLoading ? '儲存中...' : (currentService.id ? '儲存變更' : '新增服務') }}
            </button>
            <button v-if="currentService.id" @click="deleteService(currentService.id)" type="button" :disabled="serviceStore.isLoading"
              class="w-full mt-3 sm:mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ serviceStore.isLoading ? '刪除中...' : '刪除服務' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNotification } from '../../composables/useNotification';
import { useServiceStore } from '../../stores/service'; // 引入 useServiceStore

const serviceStore = useServiceStore(); // 使用 serviceStore

const isModalOpen = ref(false);
const currentService = ref({});
const selectedServices = ref([]); // 用於批量操作
const imageInput = ref(null); // 用於圖片檔案輸入的引用
const filterCategory = ref(''); // 新增：類別篩選
const filterStatus = ref(''); // 新增：狀態篩選

const { showSuccess, showError } = useNotification(); // 使用通知組合式函數

// 組件掛載時載入數據
onMounted(async () => {
  try {
    await serviceStore.fetchServices(); // 調用 Pinia Store 的 action
  } catch (error) {
    console.error('載入服務失敗:', error);
    showError(serviceStore.error || '載入服務失敗，請稍後再試。');
  }
});

const filteredServices = computed(() => {
  return serviceStore.services.filter(service => {
    const categoryMatch = !filterCategory.value || service.category === filterCategory.value;
    const statusMatch = filterStatus.value === '' || String(service.is_active) === filterStatus.value;
    return categoryMatch && statusMatch;
  });
});

const isAllSelected = computed(() => {
  return serviceStore.services.length > 0 && selectedServices.value.length === serviceStore.services.length;
});

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedServices.value = [];
  } else {
    selectedServices.value = serviceStore.services.map(s => s.id);
  }
}

function showModal(service) {
  currentService.value = service ? { ...service } : { id: null, name: '', description: '', price: null, min_duration: null, max_duration: null, category: '', is_active: true, image_url: '' };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  currentService.value = {}; // 清空
}

async function saveService() { // 本地函數
  if (!currentService.value.name || !currentService.value.price || currentService.value.min_duration === null || currentService.value.max_duration === null) {
    showError('請填寫服務名稱、價格、最短時長和最長時長。');
    return;
  }

  if (currentService.value.min_duration > currentService.value.max_duration) {
    showError('最短時長不能大於最長時長。');
    return;
  }

  try {
    const serviceData = {
      name: currentService.value.name,
      description: currentService.value.description,
      price: currentService.value.price,
      min_duration: currentService.value.min_duration, // 轉換為 snake_case
      max_duration: currentService.value.max_duration, // 轉換為 snake_case
      is_active: currentService.value.is_active, // 轉換為 snake_case
      category: currentService.value.category,
      image_url: currentService.value.image_url,
      ...(currentService.value.id && { id: currentService.value.id }) // 分辨編輯與新增
    };

    await serviceStore.saveService(serviceData); // 調用 Pinia Store 的 action
    showSuccess(currentService.value.id ? '服務已更新！' : '服務已新增！');
    closeModal();
  } catch (error) {
    console.error('儲存服務失敗:', error);
    showError(serviceStore.error || '儲存服務失敗，請稍後再試。');
  }
}

async function toggleStatus(service) {
  try {
    await serviceStore.updateServiceStatus(service.id, !service.is_active); // 調用 Pinia Store 的 action
    showSuccess(`服務 "${service.name}" 已${!service.is_active ? '上架' : '下架'}！`);
  } catch (error) {
    console.error('切換服務狀態失敗:', error);
    showError(serviceStore.error || '切換服務狀態失敗，請稍後再試。');
  }
}

async function deleteService(id) {
  if (confirm('您確定要刪除此服務嗎？')) {
    try {
      await serviceStore.deleteService(id); // 調用 Pinia Store 的 action
      showSuccess('服務已刪除！');
      closeModal();
    } catch (error) {
      console.error('刪除服務失敗:', error);
      showError(serviceStore.error || '刪除服務失敗，請稍後再試。');
    }
  }
}

async function bulkAction(action) {
  if (selectedServices.value.length === 0) {
    showError('請選擇至少一項服務。');
    return;
  }

  let confirmMessage = '';
  let successMessage = '';

  if (action === 'activate') {
    confirmMessage = `您確定要上架選定的 ${selectedServices.value.length} 項服務嗎？`;
    successMessage = '選定服務已批量上架！';
  } else if (action === 'deactivate') {
    confirmMessage = `您確定要下架選定的 ${selectedServices.value.length} 項服務嗎？`;
    successMessage = '選定服務已批量下架！';
  } else if (action === 'delete') {
    confirmMessage = `您確定要刪除選定的 ${selectedServices.value.length} 項服務嗎？此操作不可逆！`;
    successMessage = '選定服務已批量刪除！';
  }

  if (confirm(confirmMessage)) {
    try {
      await serviceStore.bulkServiceAction(action, selectedServices.value); // 調用 Pinia Store 的 action
      selectedServices.value = []; // 清空選中
      showSuccess(successMessage);
    } catch (error) {
      console.error('批量操作失敗:', error);
      showError(serviceStore.error || '批量操作失敗，請稍後再試。');
    }
  }
}

// --- 圖片上傳相關 --- 
function triggerImageUpload() {
  imageInput.value.click();
}

async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    try {
      const base64String = await toBase64(file);
      currentService.value.image_url = base64String;
      showSuccess('圖片已成功預覽！');
    } catch (error) {
      console.error('圖片轉換失敗:', error);
      showError('圖片讀取失敗，請選擇其他圖片。');
    }
  }
}

// 將檔案轉換為 Base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
</script>

<style scoped>
/* 這裡可以放置 ServiceManagement 特有的樣式，但盡量使用 Tailwind CSS */
</style>
