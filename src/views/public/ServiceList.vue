<template>
  <div class="service-list-page">
    <h1>服務項目</h1>
    <div class="service-item" v-for="service in services" :key="service.id">
      <div class="service-info">
        <h2>{{ service.name }}</h2>
        <p>{{ service.description }}</p>
      </div>
      <div class="service-details">
        <span>價格: NT$ {{ service.price }}</span>
        <span>所需時間: {{ service.duration }} 分鐘</span>
        <button @click="bookService(service.id)">選擇此服務</button>
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
  { id: 2, name: '日式嫁接睫毛', description: '自然濃密的日式睫毛嫁接，讓雙眼更有神。' , price: 1800, duration: 120 },
  { id: 3, name: '頭皮護理', description: '深層清潔與滋養，改善頭皮健康。' , price: 900, duration: 60 },
]);

function bookService(serviceId) {
  // 導向到預約流程，並帶上所選服務的 ID
  router.push({ path: '/booking', query: { service: serviceId } });
}
</script>

<style scoped>
.service-list-page {
  padding: 20px;
}
.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 20px 0;
}
.service-info {
  flex-grow: 1;
}
.service-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.service-details span {
  margin-bottom: 10px;
}
</style>
