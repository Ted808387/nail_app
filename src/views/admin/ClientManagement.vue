<template>
  <div class="client-management-page">
    <h1>客戶名單管理</h1>
    <input type="text" placeholder="搜尋客戶姓名或 Email">
    <table>
      <thead>
        <tr>
          <th>姓名</th>
          <th>Email</th>
          <th>聯絡電話</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="client in clients" :key="client.id">
          <td>{{ client.name }}</td>
          <td>{{ client.email }}</td>
          <td>{{ client.phone }}</td>
          <td><button @click="viewClientDetails(client.id)">查看詳情</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const clients = ref([
  { id: 1, name: '陳小姐', email: 'chen@email.com', phone: '0911111111' },
  { id: 2, name: '林先生', email: 'lin@email.com', phone: '0922222222' },
]);

function viewClientDetails(clientId) {
  console.log('查看客戶詳情:', clientId);
  // 這裡可以導向到一個客戶詳細資訊頁面，或彈出一個 Modal
}
</script>

<style scoped>
.client-management-page { padding: 20px; }
input { margin-bottom: 20px; padding: 8px; width: 300px; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
</style>
