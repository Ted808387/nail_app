<template>
  <div class="signin-page">
    <h1>登入</h1>
    <form @submit.prevent="handleSignIn">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">密碼</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">登入</button>
    </form>
    <p>還沒有帳號？ <router-link to="/account/signup">點此註冊</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

function handleSignIn() {
  console.log('登入資訊:', { email: email.value, password: password.value });
  // 在此處加入呼叫後端 API 進行登入驗證的邏輯
  // 假設登入成功後，需要判斷使用者角色
  const userRole = 'admin'; // or 'customer', 這裡先寫死

  if (userRole === 'admin') {
    router.push('/admin');
  } else {
    router.push('/my-bookings');
  }
}
</script>

<style scoped>
.signin-page { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; }
.form-group input { width: 100%; padding: 8px; box-sizing: border-box; }
button { width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
p { margin-top: 20px; text-align: center; }
</style>
