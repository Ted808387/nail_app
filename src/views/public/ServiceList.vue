<template>
  <div class="min-h-screen bg-soft-blue-50 p-8">
    <h1 class="text-4xl font-bold text-soft-blue-800 text-center mb-10">服務項目</h1>

    <div class="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
      <!-- 篩選功能 -->
      <div class="w-full md:w-1/3">
        <label for="category-filter" class="block text-soft-blue-700 text-sm font-bold mb-2">篩選類別:</label>
        <select id="category-filter" v-model="selectedCategory"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-soft-blue-700 leading-tight focus:outline-none focus:shadow-outline">
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
        <label for="sort-by" class="block text-soft-blue-700 text-sm font-bold mb-2">排序方式:</label>
        <select id="sort-by" v-model="sortBy"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-soft-blue-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="price-asc">價格 (由低到高)</option>
          <option value="price-desc">價格 (由高到低)</option>
          <option value="duration-asc">時間 (由短到長)</option>
          <option value="duration-desc">時間 (由長到短)</option>
        </select>
      </div>
    </div>

    <div class="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-soft-blue-200">
      <div class="service-item flex flex-col md:flex-row items-center justify-between border-b border-soft-blue-200 py-5 last:border-b-0"
        v-for="service in filteredAndSortedServices" :key="service.id">
        <div class="service-image w-full md:w-1/4 mb-4 md:mb-0 md:mr-6">
          <img :src="service.imageUrl || 'https://via.placeholder.com/150?text=Service'" :alt="service.name"
            class="w-full h-32 object-cover rounded-lg shadow-md">
        </div>
        <div class="service-info flex-grow pr-4 text-center md:text-left">
          <h2 class="text-2xl font-semibold text-soft-blue-700 mb-1">{{ service.name }}</h2>
          <p class="text-soft-blue-600 text-base mb-2">{{ service.description }}</p>
          <span class="text-soft-blue-500 text-sm font-medium">類別: {{ service.category }}</span>
        </div>
        <div class="service-details flex flex-col items-center md:items-end text-center md:text-right mt-4 md:mt-0">
          <span class="text-soft-blue-700 text-lg font-medium mb-1">價格: NT$ {{ service.price }}</span>
          <span class="text-soft-blue-600 text-sm mb-3">所需時間: {{ service.duration }} 分鐘</span>
          <button @click="bookService(service.id)"
            class="px-6 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 text-base">
            選擇此服務
          </button>
        </div>
      </div>
      <p v-if="filteredAndSortedServices.length === 0" class="text-center text-soft-blue-600 text-lg py-8">
        目前沒有符合條件的服務項目。
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const services = ref([
  { id: 1, name: '手部光療', description: '專業細緻的手部光療服務，包含基礎保養與多樣款式選擇。', price: 1200, duration: 90, category: '手部護理', imageUrl: 'https://via.placeholder.com/150?text=Hand+Gel' },
  { id: 2, name: '日式嫁接睫毛', description: '自然濃密的日式睫毛嫁接，採用輕柔手法，讓雙眼更有神。', price: 1800, duration: 120, category: '美睫', imageUrl: 'https://via.placeholder.com/150?text=Eyelash' },
  { id: 3, name: '頭皮深層護理', description: '深層清潔與滋養頭皮，改善髮質問題，讓您的頭皮重獲健康活力。', price: 900, duration: 60, category: '頭皮護理', imageUrl: 'https://via.placeholder.com/150?text=Scalp' },
  { id: 4, name: '美白保濕護膚', description: '針對肌膚暗沉與乾燥問題，提供深層美白與保濕護理。', price: 1500, duration: 90, category: '臉部護理', imageUrl: 'https://via.placeholder.com/150?text=Facial' },
  { id: 5, name: '足部深層保養', description: '專業足部去角質、修剪與滋潤，讓雙足恢復柔嫩。', price: 1000, duration: 60, category: '足部護理', imageUrl: 'https://via.placeholder.com/150?text=Foot' },
  { id: 6, name: '法式指甲', description: '經典法式指甲，簡約優雅，適合各種場合。', price: 800, duration: 75, category: '手部護理', imageUrl: 'https://via.placeholder.com/150?text=French+Nails' },
]);

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
  router.push({ path: '/booking', query: { service: serviceId } });
}
</script>

<style scoped>
/* 這裡可以放置 ServiceList 特有的樣式，但盡量使用 Tailwind CSS */
</style>
