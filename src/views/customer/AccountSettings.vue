<template>
  <div class="min-h-screen bg-soft-blue-50 p-8">
    <h1 class="text-4xl font-bold text-soft-blue-800 text-center mb-10">帳號設定</h1>

    <div v-if="userProfileStore.userProfile" class="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-soft-blue-200">
      <!-- 頭像上傳區 (Placeholder) -->
      <div class="flex flex-col items-center mb-8 pb-8 border-b border-soft-blue-200">
        <img :src="userProfileStore.userProfile?.avatar_url || 'https://via.placeholder.com/150?text=Avatar'" alt="User Avatar"
          class="w-32 h-32 rounded-full object-cover mb-4 shadow-md border-2 border-blue-300">
        <button @click="uploadAvatar" :disabled="userProfileStore.isLoading"
          class="px-6 py-2 bg-soft-blue-500 text-white rounded-full shadow-md hover:bg-soft-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ userProfileStore.isLoading ? '上傳中...' : '上傳頭像' }}
        </button>
        <input type="file" ref="avatarInput" @change="handleAvatarChange" accept="image/*" class="hidden">
      </div>

      <form @submit.prevent="updateProfile" class="mb-10 pb-10 border-b border-soft-blue-200">
        <h2 class="text-3xl font-semibold text-soft-blue-700 mb-6">修改基本資料</h2>
        <div class="mb-5">
          <label for="name" class="block text-soft-blue-700 text-sm font-bold mb-2">姓名</label>
          <input type="text" id="name" v-model="userProfileStore.userProfile.name"
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
        </div>
        <div class="mb-5">
          <label for="email" class="block text-soft-blue-700 text-sm font-bold mb-2">Email</label>
          <input type="email" id="email" v-model="userProfileStore.userProfile.email" disabled
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 bg-gray-100 cursor-not-allowed leading-tight">
          <p class="text-sm text-soft-blue-500 mt-1">Email 為帳號，不可修改。</p>
        </div>
        <div class="mb-6">
          <label for="phone" class="block text-soft-blue-700 text-sm font-bold mb-2">聯絡電話</label>
          <input type="tel" id="phone" v-model="userProfileStore.userProfile.phone_number"
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
        </div>
        <button type="submit" :disabled="userProfileStore.isLoading"
          class="px-8 py-3 bg-soft-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ userProfileStore.isLoading ? '儲存中...' : '儲存變更' }}
        </button>
      </form>

      <form @submit.prevent="changePassword" class="mb-10 pb-10 border-b border-soft-blue-200">
        <h2 class="text-3xl font-semibold text-soft-blue-700 mb-6">變更密碼</h2>
        <div class="mb-5">
          <label for="current-password" class="block text-soft-blue-700 text-sm font-bold mb-2">目前密碼</label>
          <input type="password" id="current-password" v-model="password.current" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
        </div>
        <div class="mb-5">
          <label for="new-password" class="block text-soft-blue-700 text-sm font-bold mb-2">新密碼</label>
          <input type="password" id="new-password" v-model="password.new" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          <p v-if="passwordErrors.new" class="text-red-500 text-xs italic mt-1">{{ passwordErrors.new }}</p>
        </div>
        <div class="mb-6">
          <label for="confirm-new-password" class="block text-soft-blue-700 text-sm font-bold mb-2">確認新密碼</label>
          <input type="password" id="confirm-new-password" v-model="password.confirmNew" required
            class="shadow appearance-none border border-soft-blue-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-soft-blue-400">
          <p v-if="passwordErrors.confirmNew" class="text-red-500 text-xs italic mt-1">{{ passwordErrors.confirmNew }}</p>
        </div>
        <button type="submit" :disabled="userProfileStore.isLoading"
          class="px-8 py-3 bg-soft-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ userProfileStore.isLoading ? '更新中...' : '更新密碼' }}
        </button>
      </form>

      <section class="notification-settings">
        <h2 class="text-3xl font-semibold text-soft-blue-700 mb-6">通知設定</h2>
        <div class="mb-4">
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="notificationSettings.email" class="form-checkbox h-5 w-5 text-soft-blue-600">
            <span class="ml-2 text-soft-blue-700 text-lg">Email 通知</span>
          </label>
        </div>
        <div class="mb-6">
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="notificationSettings.sms" class="form-checkbox h-5 w-5 text-soft-blue-600">
            <span class="ml-2 text-soft-blue-700 text-lg">簡訊通知</span>
          </label>
        </div>
        <button @click="saveNotificationSettings" :disabled="userProfileStore.isLoading"
          class="px-8 py-3 bg-soft-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-soft-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ userProfileStore.isLoading ? '儲存中...' : '儲存通知設定' }}
        </button>
      </section>
    </div>
    <div v-else class="max-w-2xl mx-auto text-center text-soft-blue-600 text-lg py-10">
      載入用戶資料中...
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useNotification } from '../../composables/useNotification';
import { useUserProfileStore } from '../../stores/userProfile'; // 引入 userProfile store

const userProfileStore = useUserProfileStore(); // 使用 userProfile store
const { showSuccess, showError } = useNotification(); // 使用通知組合式函數

// 密碼相關的響應式變數
const password = reactive({
  current: '',
  new: '',
  confirmNew: ''
});

const passwordErrors = reactive({
  new: '',
  confirmNew: ''
});

const notificationSettings = reactive({
  email: true,
  sms: false
});

const avatarInput = ref(null); // 用於檔案輸入的引用

// 在組件掛載時載入用戶資料
onMounted(async () => {
  await userProfileStore.fetchUserProfile();
});

// 監聽 userProfileStore.userProfile 的變化，並更新本地的 profile 數據
// 由於現在直接綁定到 store 的 userProfile，這個 watch 已經不需要了
// watch(() => userProfileStore.userProfile, (newProfile) => {
//   if (newProfile) {
//     profile.name = newProfile.name;
//     profile.email = newProfile.email;
//     profile.phone = newProfile.phone_number;
//   }
// }, { immediate: true });

async function updateProfile() {
  try {
    const updatedData = {
      name: userProfileStore.userProfile.name,
      phone_number: userProfileStore.userProfile.phone_number, // 注意這裡的欄位名稱對應後端
      avatar_url: userProfileStore.userProfile.avatar_url, // 包含 avatar_url
    };
    await userProfileStore.updateUserProfile(updatedData);
    showSuccess('個人資料已儲存！');
  } catch (error) {
    console.error('更新個人資料失敗:', error);
    showError(userProfileStore.error || '更新個人資料失敗，請稍後再試。');
  }
}

function validatePassword() {
  passwordErrors.new = '';
  passwordErrors.confirmNew = '';
  let isValid = true;

  if (password.new.length < 6) { // 密碼長度驗證應與後端一致
    passwordErrors.new = '新密碼至少需要 6 個字元。';
    showError('新密碼至少需要 6 個字元。');
    isValid = false;
  } else if (!/[a-zA-Z]/.test(password.new) || !/\d/.test(password.new)) {
    passwordErrors.new = '新密碼必須包含字母和數字。';
    showError('新密碼必須包含字母和數字。');
    isValid = false;
  }

  if (password.new !== password.confirmNew) {
    passwordErrors.confirmNew = '新密碼與確認密碼不符。';
    showError('新密碼與確認密碼不符。');
    isValid = false;
  }

  return isValid;
}

async function changePassword() {
  if (!validatePassword()) {
    return;
  }

  try {
    const passwordData = {
      current_password: password.current,
      new_password: password.new,
    };
    await userProfileStore.changeUserPassword(passwordData);
    showSuccess('密碼已成功更新！');
    password.current = '';
    password.new = '';
    password.confirmNew = '';
  } catch (error) {
    console.error('變更密碼失敗:', error);
    showError(userProfileStore.error || '變更密碼失敗，請稍後再試。');
  }
}

async function saveNotificationSettings() {
  console.log('儲存通知設定:', notificationSettings);
  try {
    // 在此處加入呼叫後端 API 的邏輯
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬網路延遲
    showSuccess('通知設定已儲存！');
  } catch (error) {
    console.error('儲存通知設定失敗:', error);
    showError('儲存通知設定失敗，請稍後再試。');
  }
}

// 頭像上傳相關函數
function uploadAvatar() {
  avatarInput.value.click();
}

async function handleAvatarChange(event) {
  const file = event.target.files[0];
  if (file) {
    try {
      const base64String = await toBase64(file);
      // 直接更新 store 中的 avatar_url
      userProfileStore.userProfile.avatar_url = base64String;
      showSuccess('圖片已成功預覽！請點擊儲存變更以保存。');
    } catch (error) {
      console.error('圖片轉換失敗:', error);
      showError('圖片讀取失敗，請選擇其他圖片。');
    }
  }
}

// 將檔案轉換為 Base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
</script>

<style scoped>
/* 這裡可以放置 AccountSettings 特有的樣式，但盡量使用 Tailwind CSS */
</style>