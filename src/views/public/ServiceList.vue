<template>
  <div class="min-h-screen bg-soft-blue-50 p-4 sm:p-6 md:p-8">
    <h1 class="text-3xl sm:text-4xl font-bold text-soft-blue-800 text-center mb-8 sm:mb-10">服務項目</h1>

    <div class="max-w-5xl mx-auto mb-6 sm:mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
      <!-- 篩選功能 -->
      <div class="w-full md:w-1/3">
        <label for="category-filter" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2">篩選類別:</label>
        <select id="category-filter" v-model="selectedCategory"
          class="shadow appearance-none border rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-soft-blue-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          <option value="">所有類別</option>
          <option value="手部護理">手部護理</option>
          <option value="美睫">美睫</option>
          <option value="頭皮護理">頭皮護理</option>
          <option value="臉部護理">臉部護理</option>
          <option value="足部護理">足部護理</option>
        </select>
      </div>

      <!-- 排序功能 -->
      <div class="w-full md:w-1/3">
        <label for="sort-by" class="block text-soft-blue-700 text-sm sm:text-base font-bold mb-2">排序方式:</label>
        <select id="sort-by" v-model="sortBy"
          class="shadow appearance-none border rounded-xl w-full py-2 sm:py-3 px-3 sm:px-4 text-soft-blue-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          <option value="price-asc">價格 (由低到高)</option>
          <option value="price-desc">價格 (由高到低)</option>
          <option value="duration-asc">時間 (由短到長)</option>
          <option value="duration-desc">時間 (由長到短)</option>
        </select>
      </div>
    </div>

    <div class="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-soft-blue-200">
      <div class="service-item flex flex-col md:flex-row items-center justify-between border-b border-soft-blue-200 py-4 sm:py-5 last:border-b-0"
        v-for="service in filteredAndSortedServices" :key="service.id">
        <div class="service-image w-full md:w-1/4 mb-4 md:mb-0 md:mr-6">
          <img :src="service.imageUrl || 'https://via.placeholder.com/150?text=Service'" :alt="service.name"
            class="w-full h-24 sm:h-32 object-cover rounded-lg shadow-md">
        </div>
        <div class="service-info flex-grow pr-0 md:pr-4 text-center md:text-left mb-4 md:mb-0">
          <h2 class="text-xl sm:text-2xl font-semibold text-soft-blue-700 mb-1">{{ service.name }}</h2>
          <p class="text-sm sm:text-base text-soft-blue-600 mb-2">{{ service.description }}</p>
          <span class="text-xs sm:text-sm font-medium text-soft-blue-500">類別: {{ service.category }}</span>
        </div>
        <div class="service-details flex flex-col items-center md:items-end text-center md:text-right mt-0 md:mt-0">
          <span class="text-base sm:text-lg font-medium text-soft-blue-700 mb-1">價格: NT$ {{ service.price }}</span>
          <span class="text-xs sm:text-sm mb-3 text-soft-blue-600">所需時間: {{ service.duration }} 分鐘</span>
          <button @click="bookService(service.id)"
            class="px-5 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 text-sm sm:text-base">
            選擇此服務
          </button>
        </div>
      </div>
      <p v-if="filteredAndSortedServices.length === 0" class="text-center text-soft-blue-600 text-base sm:text-lg py-8">
        目前沒有符合條件的服務項目。
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'; // 引入 onMounted
import { useRouter } from 'vue-router';
import { useNotification } from '../../composables/useNotification';
import { loadServices } from '../../services/dataService'; // 引入 loadServices

const router = useRouter();
const { showInfo } = useNotification();

const services = ref([]); // 初始化為空陣列

// 組件掛載時載入數據
onMounted(() => {
  services.value = loadServices();
});

const selectedCategory = ref('');
const sortBy = ref('price-asc'); // 預設按價格由低到高排序

const filteredAndSortedServices = computed(() => {
  let displayServices = [...services.value]; // 複製一份，避免直接修改原始數據

  // 篩選
  if (selectedCategory.value) {
    displayServices = displayServices.filter(service => service.category === selectedCategory.value);
  }

  // 排序
  displayServices.sort((a, b) => {
    if (sortBy.value === 'price-asc') {
      return a.price - b.price;
    } else if (sortBy.value === 'price-desc') {
      return b.price - a.price;
    } else if (sortBy.value === 'duration-asc') {
      return a.duration - b.duration;
    } else if (sortBy.value === 'duration-desc') {
      return b.duration - a.duration;
    }
    return 0;
  });

  return displayServices;
});

function bookService(serviceId) {
  // 導向到預約流程，並帶上所選服務的 ID
  showInfo('服務已加入預約流程！'); // 使用通知
  router.push({ path: '/booking', query: { service: serviceId } });
}
</script>

<style scoped>
/* 這裡可以放置 ServiceList 特有的樣式，但盡量使用 Tailwind CSS */
</style>