import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchUserById as apiFetchUserById, updateUserProfile as apiUpdateUserProfile, changeUserPassword as apiChangeUserPassword } from '../api';
import { useNotification } from '../composables/useNotification';

export const useUserProfileStore = defineStore('userProfile', () => {
  const userProfile = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const { showSuccess, showError } = useNotification();

  async function fetchUserProfile() {
    isLoading.value = true;
    error.value = null;
    try {
      const fetchedProfile = await apiFetchUserById();
      userProfile.value = fetchedProfile;
      showSuccess('用戶個人資料載入成功！');
    } catch (err) {
      error.value = err;
      showError('載入用戶個人資料失敗！');
      console.error('Error fetching user profile:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateUserProfile(profileData) {
    isLoading.value = true;
    error.value = null;
    try {
      const updatedProfile = await apiUpdateUserProfile(profileData);
      userProfile.value = updatedProfile;
      showSuccess('用戶個人資料已成功更新！');
      return updatedProfile;
    } catch (err) {
      error.value = err;
      showError('更新用戶個人資料失敗！');
      console.error('Error updating user profile:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function changeUserPassword(passwords) {
    isLoading.value = true;
    error.value = null;
    try {
      await apiChangeUserPassword(passwords);
      showSuccess('密碼已成功變更！');
    } catch (err) {
      error.value = err;
      showError('變更密碼失敗！');
      console.error('Error changing password:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    userProfile,
    isLoading,
    error,
    fetchUserProfile,
    updateUserProfile,
    changeUserPassword,
  };
});