// src/api/index.js
import axios from 'axios';
import { useAuth } from '../composables/useAuth';

const API_BASE_URL = 'http://127.0.0.1:8000'; // 後端 FastAPI 服務的地址

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器：在每個請求中添加 JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const storedUserId = localStorage.getItem('currentUserId');
    const token = storedUserId ? localStorage.getItem(`token_${storedUserId}`) : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器：處理全局錯誤，例如 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 處理 401 Unauthorized 錯誤，例如導向登入頁面
      // 這裡不能直接使用 useAuth()，因為它不是在組件內部
      // 可以考慮發送一個自定義事件，讓 App.vue 或路由守衛處理登出
      console.warn('收到 401 Unauthorized，請處理登出邏輯。');
      // 臨時解決方案：直接清除 localStorage 中的 token 並重新導向
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('currentUserRole');
      // 遍歷並移除所有 token
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('token_')) {
          localStorage.removeItem(key);
        }
      }
      window.location.href = '/account/signin'; // 強制重新導向
    }
    return Promise.reject(error);
  }
);

// 模擬網路延遲 (不再需要，因為是真實 API 呼叫)
// const simulateDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// --- 預約 API ---
export const fetchBookings = async () => {
  try {
    const { isAdmin } = useAuth(); // 獲取 isAdmin 狀態
    let url = '/bookings/my'; // 預設為普通用戶的預約
    if (isAdmin.value) {
      url = '/bookings/'; // 如果是管理員，獲取所有預約
    }
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const saveBooking = async (booking) => {
  try {
    const response = await apiClient.post('/bookings/', booking);
    return response.data;
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
};

export const updateBooking = async (bookingId, bookingData) => {
  try {
    const response = await apiClient.put(`/bookings/${bookingId}`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

export const deleteBooking = async (id) => {
  try {
    await apiClient.delete(`/bookings/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

// --- 服務 API ---
export const fetchServices = async () => {
  try {
    const response = await apiClient.get('/services/');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const saveService = async (service) => {
  try {
    if (service.id) {
      const response = await apiClient.put(`/services/${service.id}`, service);
      return response.data;
    } else {
      const response = await apiClient.post('/services/', service);
      return response.data;
    }
  } catch (error) {
    console.error('Error saving service:', error);
    throw error;
  }
};

export const updateServiceStatus = async (serviceId, isActive) => {
  try {
    const response = await apiClient.patch(`/services/${serviceId}/status`, { is_active: isActive });
    return response.data;
  } catch (error) {
    console.error('Error updating service status:', error);
    throw error;
  }
};

export const deleteServiceApi = async (id) => { // Renamed to avoid conflict with component function
  try {
    await apiClient.delete(`/services/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

export const bulkServiceAction = async (action, serviceIds) => {
  try {
    const response = await apiClient.post('/services/bulk-action', { action, service_ids: serviceIds });
    return response.data;
  } catch (error) {
    console.error('Error performing bulk service action:', error);
    throw error;
  }
};


// --- 客戶 API ---
export const fetchClients = async () => {
  try {
    const response = await apiClient.get('/admin/clients/');
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

export const fetchClientById = async (id) => {
  try {
    const response = await apiClient.get(`/admin/clients/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    throw error;
  }
};

export const updateClient = async (client) => {
  try {
    const response = await apiClient.put(`/admin/clients/${client.id}`, client);
    return response.data;
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

// --- 營業設定 API ---
export const fetchBusinessSettings = async () => {
  try {
    const response = await apiClient.get('/admin/settings/');
    return response.data;
  } catch (error) {
    console.error('Error fetching business settings:', error);
    throw error;
  }
};

export const saveBusinessSettings = async (settings) => {
  try {
    const response = await apiClient.put('/admin/settings/', settings);
    return response.data;
  } catch (error) {
    console.error('Error saving business settings:', error);
    throw error;
  }
};

// --- 用戶認證 API ---
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  console.trace('loginUser 被呼叫');
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    const { access_token, user_id, user_role } = response.data;
    // 將 token 儲存到 localStorage，以 user_id 為 key
    localStorage.setItem(`token_${user_id}`, access_token);
    return { user_id, user_role };
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

export const fetchUserById = async (id) => {
  // This function now gets the current user's data, so the 'id' parameter is no longer needed.
  try {
    const response = await apiClient.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const updateUserProfile = async (userProfile) => {
  try {
    const response = await apiClient.put('/users/me', userProfile);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const changeUserPassword = async (passwords) => {
  try {
    const response = await apiClient.post('/users/me/change-password', passwords);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};
