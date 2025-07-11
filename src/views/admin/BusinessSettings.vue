<template>
  <div class="business-settings-page">
    <h1>營業設定</h1>
    <form @submit.prevent="saveSettings">
      <h2>營業時間</h2>
      <div v-for="day in businessHours" :key="day.id" class="day-setting">
        <label>{{ day.name }}</label>
        <input type="time" v-model="day.open">
        <span> - </span>
        <input type="time" v-model="day.close">
        <input type="checkbox" v-model="day.isClosed"> 休息
      </div>

      <h2>特別公休日</h2>
      <!-- 這裡可以放一個日期選擇器來新增公休日 -->

      <button type="submit">儲存設定</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const businessHours = ref([
  { id: 1, name: '星期一', open: '10:00', close: '19:00', isClosed: false },
  { id: 2, name: '星期二', open: '10:00', close: '19:00', isClosed: false },
  // ... 其他日子
  { id: 7, name: '星期日', open: '10:00', close: '19:00', isClosed: true },
]);

function saveSettings() {
  console.log('儲存營業設定:', businessHours.value);
}
</script>

<style scoped>
.business-settings-page { padding: 20px; max-width: 700px; }
.day-setting { display: flex; align-items: center; margin-bottom: 10px; }
.day-setting label { width: 80px; }
.day-setting span { margin: 0 10px; }
button { margin-top: 20px; padding: 10px 20px; }
</style>
