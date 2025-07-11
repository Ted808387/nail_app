<template>
  <div class="account-settings-page">
    <h1>帳號設定</h1>
    <form @submit.prevent="updateProfile">
      <h2>修改基本資料</h2>
      <div class="form-group">
        <label for="name">姓名</label>
        <input type="text" id="name" v-model="profile.name">
      </div>
      <div class="form-group">
        <label for="phone">聯絡電話</label>
        <input type="tel" id="phone" v-model="profile.phone">
      </div>
      <button type="submit">儲存變更</button>
    </form>

    <form @submit.prevent="changePassword" class="password-form">
      <h2>變更密碼</h2>
      <div class="form-group">
        <label for="current-password">目前密碼</label>
        <input type="password" id="current-password" v-model="password.current">
      </div>
      <div class="form-group">
        <label for="new-password">新密碼</label>
        <input type="password" id="new-password" v-model="password.new">
      </div>
      <button type="submit">更新密碼</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 這裡僅為示意，實際應從後端獲取使用者資料
const profile = ref({
  name: '範例使用者',
  phone: '0912345678'
});

const password = ref({
  current: '',
  new: ''
});

function updateProfile() {
  console.log('更新個人資料:', profile.value);
  // 在此處加入呼叫後端 API 的邏輯
}

function changePassword() {
  console.log('變更密碼');
  // 在此處加入呼叫後端 API 的邏輯
}
</script>

<style scoped>
.account-settings-page { max-width: 600px; margin: 20px auto; padding: 20px; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; }
.form-group input { width: 100%; padding: 8px; box-sizing: border-box; }
button { padding: 10px 15px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
.password-form { margin-top: 40px; }
</style>
