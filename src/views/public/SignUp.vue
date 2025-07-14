<template>
  <div class="min-h-screen flex items-center justify-center bg-soft-blue-50 p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-soft-blue-200">
      <h1 class="text-3xl font-bold text-soft-blue-800 text-center mb-8">建立您的帳號</h1>
      <form @submit.prevent="handleSignUp">
        <div class="mb-5">
          <label for="name" class="block text-soft-blue-700 text-sm font-bold mb-2">姓名 <span class="text-red-500">*</span></label>
          <input type="text" id="name" v-model="name" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          <p v-if="errors.name" class="text-red-500 text-xs italic mt-1">{{ errors.name }}</p>
        </div>
        <div class="mb-5">
          <label for="email" class="block text-soft-blue-700 text-sm font-bold mb-2">Email <span class="text-red-500">*</span></label>
          <input type="email" id="email" v-model="email" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          <p v-if="errors.email" class="text-red-500 text-xs italic mt-1">{{ errors.email }}</p>
        </div>
        <div class="mb-5">
          <label for="phone" class="block text-soft-blue-700 text-sm font-bold mb-2">手機號碼 <span class="text-red-500">*</span></label>
          <input type="tel" id="phone" v-model="phoneNumber" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          <p v-if="errors.phoneNumber" class="text-red-500 text-xs italic mt-1">{{ errors.phoneNumber }}</p>
        </div>
        <div class="mb-5">
          <label for="password" class="block text-soft-blue-700 text-sm font-bold mb-2">密碼 <span class="text-red-500">*</span></label>
          <input type="password" id="password" v-model="password" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          <p v-if="errors.password" class="text-red-500 text-xs italic mt-1">{{ errors.password }}</p>
        </div>
        <div class="mb-6">
          <label for="confirm-password" class="block text-soft-blue-700 text-sm font-bold mb-2">確認密碼 <span class="text-red-500">*</span></label>
          <input type="password" id="confirm-password" v-model="confirmPassword" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          <p v-if="errors.confirmPassword" class="text-red-500 text-xs italic mt-1">{{ errors.confirmPassword }}</p>
        </div>
        <div class="mb-6">
          <label for="admin-code" class="block text-soft-blue-700 text-sm font-bold mb-2">管理員驗證碼 (選填)</label>
          <input type="text" id="admin-code" v-model="adminCode" placeholder="請輸入 BEAUTY2025"
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          <p v-if="isAdmin" class="text-soft-blue-600 text-xs italic mt-2">您將註冊為管理員帳號。</p>
        </div>

        <div class="mb-6 flex items-center">
          <input type="checkbox" id="terms" v-model="agreeToTerms" class="mr-2 leading-tight">
          <label for="terms" class="text-sm text-soft-blue-700">
            我同意 <a href="#" class="text-soft-blue-600 hover:underline">隱私政策</a> 和 <a href="#" class="text-soft-blue-600 hover:underline">服務條款</a> <span class="text-red-500">*</span>
          </label>
          <p v-if="errors.agreeToTerms" class="text-red-500 text-xs italic mt-1">{{ errors.agreeToTerms }}</p>
        </div>

        <button type="submit"
          class="w-full bg-soft-blue-600 hover:bg-soft-blue-700 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition duration-300">
          註冊
        </button>
      </form>
      <p class="text-center text-soft-blue-600 text-sm mt-6">
        已經有帳號了？
        <router-link to="/account/signin" class="text-soft-blue-700 hover:text-soft-blue-900 font-bold">點此登入</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const name = ref('');
const email = ref('');
const phoneNumber = ref('');
const password = ref('');
const confirmPassword = ref('');
const adminCode = ref('');
const agreeToTerms = ref(false);

const errors = ref({});

const isAdmin = computed(() => adminCode.value === 'BEAUTY2025');

function validateForm() {
  errors.value = {}; // 重置錯誤訊息

  if (!name.value) {
    errors.value.name = '姓名為必填。';
  }
  if (!email.value) {
    errors.value.email = 'Email 為必填。';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = '請輸入有效的 Email 格式。';
  }
  if (!phoneNumber.value) {
    errors.value.phoneNumber = '手機號碼為必填。';
  }
  else if (!/^\d{10}$/.test(phoneNumber.value)) { // 簡單的手機號碼驗證，可根據需求調整
    errors.value.phoneNumber = '請輸入有效的手機號碼 (10位數字)。';
  }
  if (!password.value) {
    errors.value.password = '密碼為必填。';
  } else if (password.value.length < 8) {
    errors.value.password = '密碼至少需要 8 個字元。';
  } else if (!/[a-zA-Z]/.test(password.value) || !/\d/.test(password.value)) {
    errors.value.password = '密碼必須包含字母和數字。';
  }
  if (!confirmPassword.value) {
    errors.value.confirmPassword = '請確認密碼。';
  }
  else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = '密碼與確認密碼不符。';
  }
  if (!agreeToTerms.value) {
    errors.value.agreeToTerms = '您必須同意隱私政策和服務條款。';
  }

  return Object.keys(errors.value).length === 0;
}

async function handleSignUp() {
  if (!validateForm()) {
    return; // 如果驗證失敗，停止提交
  }

  try {
    // 這裡模擬呼叫後端 API
    console.log('提交註冊資訊:', {
      name: name.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      password: password.value,
      isAdmin: isAdmin.value,
    });

    // 假設後端 API 呼叫成功
    alert('註冊成功！');

    // 根據角色導向不同頁面
    if (isAdmin.value) {
      router.push('/admin'); // 管理員導向後台儀表板
    } else {
      router.push('/account/signin'); // 客戶導向登入頁面
    }

  } catch (error) {
    console.error('註冊失敗:', error);
    alert('註冊失敗，請稍後再試。');
    // 顯示更詳細的錯誤訊息給用戶
  }
}
</script>

<style scoped>
/* 這裡可以放置 SignUp 特有的樣式，但盡量使用 Tailwind CSS */
</style>
