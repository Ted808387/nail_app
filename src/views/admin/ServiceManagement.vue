<template>
  <div class="service-management-page">
    <h1>服務項目管理</h1>
    <button @click="showModal(null)">新增服務項目</button>
    <table>
      <thead>
        <tr>
          <th>服務名稱</th>
          <th>價格</th>
          <th>狀態</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="service in services" :key="service.id">
          <td>{{ service.name }}</td>
          <td>{{ service.price }}</td>
          <td>{{ service.isActive ? '上架中' : '已下架' }}</td>
          <td>
            <button @click="showModal(service)">編輯</button>
            <button @click="toggleStatus(service)">{{ service.isActive ? '下架' : '上架' }}</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 新增/編輯服務的 Modal -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <span class="close" @click="isModalOpen = false">&times;</span>
        <h2>{{ currentService.id ? '編輯' : '新增' }}服務</h2>
        <form @submit.prevent="saveService">
          <input v-model="currentService.name" placeholder="服務名稱">
          <input v-model="currentService.price" type="number" placeholder="價格">
          <button type="submit">儲存</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const services = ref([
  { id: 1, name: '手部光療', price: 1200, isActive: true },
  { id: 2, name: '日式嫁接睫毛', price: 1800, isActive: true },
]);
const isModalOpen = ref(false);
const currentService = ref({});

function showModal(service) {
  currentService.value = service ? { ...service } : { name: '', price: null };
  isModalOpen.value = true;
}

function saveService() { console.log('儲存服務:', currentService.value); isModalOpen.value = false; }
function toggleStatus(service) { service.isActive = !service.isActive; console.log('更新狀態:', service); }
</script>

<style scoped>
.service-management-page { padding: 20px; }
table { width: 100%; border-collapse: collapse; margin-top: 20px; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
.modal { position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4); }
.modal-content { background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%; }
.close { color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer; }
</style>
