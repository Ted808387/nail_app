import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchClients as apiFetchClients, fetchClientById as apiFetchClientById, updateClient as apiUpdateClient } from '../api';
import { useNotification } from '../composables/useNotification';

export const useClientStore = defineStore('client', () => {
  const clients = ref([]);
  const currentClient = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const { showSuccess, showError } = useNotification();

  async function fetchClients() {
    isLoading.value = true;
    error.value = null;
    try {
      const fetchedClients = await apiFetchClients();
      clients.value = fetchedClients;
      showSuccess('客戶資料載入成功！');
    } catch (err) {
      error.value = err;
      showError('載入客戶資料失敗！');
      console.error('Error fetching clients:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchClientById(id) {
    isLoading.value = true;
    error.value = null;
    try {
      const fetchedClient = await apiFetchClientById(id);
      currentClient.value = fetchedClient;
      showSuccess('客戶詳情載入成功！');
      return fetchedClient;
    } catch (err) {
      error.value = err;
      showError('載入客戶詳情失敗！');
      console.error('Error fetching client by ID:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateClient(clientData) {
    isLoading.value = true;
    error.value = null;
    try {
      const updatedClient = await apiUpdateClient(clientData);
      const index = clients.value.findIndex(c => c.id === updatedClient.id);
      if (index !== -1) {
        clients.value[index] = updatedClient;
      }
      currentClient.value = updatedClient; // 更新當前客戶詳情
      showSuccess('客戶資料已成功更新！');
      return updatedClient;
    } catch (err) {
      error.value = err;
      showError('更新客戶資料失敗！');
      console.error('Error updating client:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    clients,
    currentClient,
    isLoading,
    error,
    fetchClients,
    fetchClientById,
    updateClient,
  };
});