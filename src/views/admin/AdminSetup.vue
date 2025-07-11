<template>
  <div class="admin-setup-page">
    <h1>首次管理員設定</h1>
    <p>歡迎使用！這是系統的第一次啟動，請設定您的管理員帳號。</p>
    <form @submit.prevent="setupAdmin">
      <div class="form-group">
        <label for="name">姓名</label>
        <input type="text" id="name" v-model="name" required>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">密碼</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">完成設定並登入</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();

function setupAdmin() {
  console.log('執行首次管理員設定:', { name: name.value, email: email.value });
  // 在此處加入呼叫後端 API 的邏輯
  // 設定完成後，自動登入並導向到管理員儀表板
  router.push('/admin');
}
</script>

<style scoped>
.admin-setup-page { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; text-align: center; }
.form-group { margin-bottom: 15px; text-align: left; }
.form-group label { display: block; margin-bottom: 5px; }
.form-group input { width: 100%; padding: 8px; box-sizing: border-box; }
button { width: 100%; padding: 10px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; }
</style>
