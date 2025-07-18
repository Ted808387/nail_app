// src/api/index.js
import axios from 'axios';
import { useAuth } from '../composables/useAuth'; // 假設 useAuth 提供了獲取 token 的方法

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
    const { currentUserId } = useAuth(); // 獲取當前用戶 ID
    const token = localStorage.getItem(`token_${currentUserId.value}`); // 從 localStorage 獲取 token

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
      const { logout } = useAuth();
      logout(); // 清除認證狀態
      // 可以添加路由跳轉到登入頁面的邏輯
      // router.push('/account/signin');
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

export const addHoliday = async (holidayData) => {
  try {
    const response = await apiClient.post('/admin/settings/holidays', holidayData);
    return response.data;
  } catch (error) {
    console.error('Error adding holiday:', error);
    throw error;
  }
};

export const removeHoliday = async (holidayDate) => {
  try {
    await apiClient.delete(`/admin/settings/holidays/${holidayDate}`);
    return { success: true };
  } catch (error) {
    console.error('Error removing holiday:', error);
    throw error;
  }
};

export const addUnavailableDateApi = async (unavailableDateData) => {
  try {
    const response = await apiClient.post('/admin/settings/unavailable-dates', unavailableDateData);
    return response.data;
  } catch (error) {
    console.error('Error adding unavailable date:', error);
    throw error;
  }
};

export const removeUnavailableDateApi = async (unavailableDate) => {
  try {
    await apiClient.delete(`/admin/settings/unavailable-dates/${unavailableDate}`);
    return { success: true };
  } catch (error) {
    console.error('Error removing unavailable date:', error);
    throw error;
  }
};

export const addTimeSlotApi = async (slot) => {
  try {
    const response = await apiClient.post('/admin/settings/time-slots', slot);
    return response.data;
  } catch (error) {
    console.error('Error adding time slot:', error);
    throw error;
  }
};

export const removeTimeSlotApi = async (slotId) => {
  try {
    await apiClient.delete(`/admin/settings/time-slots/${slotId}`);
    return { success: true };
  } catch (error) {
    console.error('Error removing time slot:', error);
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
