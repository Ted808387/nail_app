import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchServices as apiFetchServices, saveService as apiSaveService, updateServiceStatus as apiUpdateServiceStatus, deleteServiceApi as apiDeleteServiceApi, bulkServiceAction as apiBulkServiceAction } from '../api';
import { useNotification } from '../composables/useNotification';

export const useServiceStore = defineStore('service', () => {
  const services = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const { showSuccess, showError } = useNotification();

  async function fetchServices() {
    isLoading.value = true;
    error.value = null;
    try {
      const fetchedServices = await apiFetchServices();
      services.value = fetchedServices;
      showSuccess('服務資料載入成功！');
    } catch (err) {
      error.value = err;
      showError('載入服務資料失敗！');
      console.error('Error fetching services:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function saveService(serviceData) {
    isLoading.value = true;
    error.value = null;
    try {
      const newService = await apiSaveService(serviceData);
      const index = services.value.findIndex(s => s.id === newService.id);
      if (index !== -1) {
        services.value[index] = newService;
      } else {
        services.value.push(newService);
      }
      showSuccess('服務已成功儲存！');
      return newService;
    } catch (err) {
      error.value = err;
      showError('儲存服務失敗！');
      console.error('Error saving service:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateServiceStatus(serviceId, isActive) {
    isLoading.value = true;
    error.value = null;
    try {
      const updatedService = await apiUpdateServiceStatus(serviceId, isActive);
      const index = services.value.findIndex(s => s.id === updatedService.id);
      if (index !== -1) {
        services.value[index] = updatedService;
      }
      showSuccess('服務狀態已成功更新！');
      return updatedService;
    } catch (err) {
      error.value = err;
      showError('更新服務狀態失敗！');
      console.error('Error updating service status:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteService(serviceId) {
    isLoading.value = true;
    error.value = null;
    try {
      await apiDeleteServiceApi(serviceId);
      services.value = services.value.filter(s => s.id !== serviceId);
      showSuccess('服務已成功刪除！');
    } catch (err) {
      error.value = err;
      showError('刪除服務失敗！');
      console.error('Error deleting service:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function bulkServiceAction(action, serviceIds) {
    isLoading.value = true;
    error.value = null;
    try {
      await apiBulkServiceAction(action, serviceIds);
      // 根據批次操作的類型更新 services 列表
      if (action === 'delete') {
        services.value = services.value.filter(s => !serviceIds.includes(s.id));
      } else if (action === 'activate') {
        services.value.forEach(s => {
          if (serviceIds.includes(s.id)) s.is_active = true;
        });
      } else if (action === 'deactivate') {
        services.value.forEach(s => {
          if (serviceIds.includes(s.id)) s.is_active = false;
        });
      }
      showSuccess('批次操作成功！');
    } catch (err) {
      error.value = err;
      showError('批次操作失敗！');
      console.error('Error performing bulk service action:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    services,
    isLoading,
    error,
    fetchServices,
    saveService,
    updateServiceStatus,
    deleteService,
    bulkServiceAction,
  };
});