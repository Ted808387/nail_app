<template>
  <div class="min-h-screen bg-soft-blue-50 p-8">
    <h1 class="text-4xl font-bold text-soft-blue-800 text-center mb-10">服務項目</h1>
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-soft-blue-200">
      <div class="service-item flex items-center justify-between border-b border-soft-blue-200 py-5 last:border-b-0"
        v-for="service in services" :key="service.id">
        <div class="service-info flex-grow pr-4">
          <h2 class="text-2xl font-semibold text-soft-blue-700 mb-1">{{ service.name }}</h2>
          <p class="text-soft-blue-600 text-base">{{ service.description }}</p>
        </div>
        <div class="service-details flex flex-col items-end text-right">
          <span class="text-soft-blue-700 text-lg font-medium mb-1">價格: NT$ {{ service.price }}</span>
          <span class="text-soft-blue-600 text-sm mb-3">所需時間: {{ service.duration }} 分鐘</span>
          <button @click="bookService(service.id)"
            class="px-6 py-2 bg-soft-blue-600 text-white rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 text-base">
            選擇此服務
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const services = ref([
  { id: 1, name: '手部光療', description: '專業細緻的手部光療服務，包含基礎保養。', price: 1200, duration: 90 },
  { id: 2, name: '日式嫁接睫毛', description: '自然濃密的日式睫毛嫁接，讓雙眼更有神。', price: 1800, duration: 120 },
  { id: 3, name: '頭皮護理', description: '深層清潔與滋養，改善頭皮健康。', price: 900, duration: 60 },
  { id: 4, name: '美白護膚', description: '深層清潔與滋養，改善頭皮健康。', price: 1500, duration: 90 },
  { id: 5, name: '足部護理', description: '深層清潔與滋養，改善頭皮健康。', price: 1000, duration: 60 },
]);

function bookService(serviceId) {
  // 導向到預約流程，並帶上所選服務的 ID
  router.push({ path: '/booking', query: { service: serviceId } });
}
</script>

<style scoped>
/* 移除舊有 CSS，完全使用 Tailwind */
</style>