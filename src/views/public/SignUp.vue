<template>
  <div class="signup-page">
    <h1>建立您的帳號</h1>
    <form @submit.prevent="handleSignUp">
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
      <div class="form-group">
        <label for="admin-code">管理員驗證碼 (選填)</label>
        <input type="text" id="admin-code" v-model="adminCode" placeholder="請輸入 BEAUTY2025">
        <small v-if="isAdmin">您將註冊為管理員帳號。</small>
      </div>
      <button type="submit">註冊</button>
    </form>
    <p>已經有帳號了？ <router-link to="/account/signin">點此登入</router-link></p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const name = ref('');
const email = ref('');
const password = ref('');
const adminCode = ref('');

const isAdmin = computed(() => adminCode.value === 'BEAUTY2025');

function handleSignUp() {
  if (isAdmin.value) {
    console.log('註冊為管理員:', { name: name.value, email: email.value });
    // 在此處加入呼叫後端 API 註冊管理員的邏輯
  } else {
    console.log('註冊為客戶:', { name: name.value, email: email.value });
    // 在此處加入呼叫後端 API 註冊客戶的邏輯
  }
  // 註冊成功後導向到對應頁面
}
</script>

<style scoped>
.signup-page { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; }
.form-group input { width: 100%; padding: 8px; box-sizing: border-box; }
button { width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
p { margin-top: 20px; text-align: center; }
</style>
