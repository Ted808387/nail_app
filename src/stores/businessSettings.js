import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchBusinessSettings as apiFetchBusinessSettings, saveBusinessSettings as apiSaveBusinessSettings } from '../api';
import { useNotification } from '../composables/useNotification';

export const useBusinessSettingsStore = defineStore('businessSettings', () => {
  const settings = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const { showSuccess, showError } = useNotification();

  async function fetchBusinessSettings() {
    isLoading.value = true;
    error.value = null;
    try {
      const fetchedSettings = await apiFetchBusinessSettings();
      settings.value = fetchedSettings;
      // showSuccess('營業設定資料載入成功！');
    } catch (err) {
      error.value = err;
      showError('載入營業設定資料失敗！');
      console.error('Error fetching business settings:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function saveBusinessSettings(settingsData) {
    isLoading.value = true;
    error.value = null;
    try {
      const updatedSettings = await apiSaveBusinessSettings(settingsData);
      settings.value = updatedSettings;
      showSuccess('營業設定已成功儲存！');
      return updatedSettings;
    } catch (err) {
      error.value = err;
      showError('儲存營業設定失敗！');
      console.error('Error saving business settings:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function setBusinessHours(hours) {
    if (!settings.value) settings.value = {};
    settings.value.business_hours = hours;
  }

  function setHolidays(holidaysData) {
    if (!settings.value) settings.value = {};
    settings.value.holidays = holidaysData;
  }

  function setUnavailableDates(dates) {
    if (!settings.value) settings.value = {};
    settings.value.unavailable_dates = dates;
  }

  function setBookableTimeSlots(slots) {
    if (!settings.value) settings.value = {};
    settings.value.bookable_time_slots = slots;
  }

  return {
    settings,
    isLoading,
    error,
    fetchBusinessSettings,
    saveBusinessSettings,
    setBusinessHours,
    setHolidays,
    setUnavailableDates,
    setBookableTimeSlots,
  };
});