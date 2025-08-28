// src/api/index.js
import axios from 'axios';
import { useAuthStore } from '../stores/auth'; // 引入 Pinia 的 auth store

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
    if (error.response && error.response.status === 401 && error.config.url !== '/auth/login') {
      const authStore = useAuthStore(); // 在這裡獲取 auth store 實例
      authStore.logout(); // 呼叫 Pinia store 的 logout action
      window.location.href = '/account/signin'; // 強制重新導向
    }
    return Promise.reject(error);
  }
);

// --- 預約 API ---
export const fetchMyBookings = async () => {
  try {
    const response = await apiClient.get('/bookings/my');
    return response.data;
  } catch (error) {
    console.error('Error fetching my bookings:', error);
    throw error;
  }
};

export const fetchAllBookings = async () => {
  try {
    const response = await apiClient.get('/bookings/');
    return response.data;
  } catch (error) {
    console.error('Error fetching all bookings:', error);
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

export const logoutUser = async () => {
  try {
    await apiClient.post('/auth/logout');
    return { success: true };
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
};

export const fetchPublicProfile = async (slug) => {
  try {
    const response = await apiClient.get(`/public/profile/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching public profile:', error);
    throw error;
  }
};

export const fetchPublicBookingsBySlug = async (slug) => {
  try {
    const response = await apiClient.get(`/public/bookings_by_slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching public bookings by slug:', error);
    throw error;
  }
};

export default {
  fetchMyBookings,
  fetchAllBookings,
  saveBooking,
  updateBooking,
  deleteBooking,
  fetchServices,
  saveService,
  updateServiceStatus,
  deleteServiceApi,
  bulkServiceAction,
  fetchClients,
  fetchClientById,
  updateClient,
  fetchBusinessSettings,
  saveBusinessSettings,
  registerUser,
  loginUser,
  fetchUserById,
  updateUserProfile,
  changeUserPassword,
  logoutUser,
  fetchPublicProfile,
  fetchPublicBookingsBySlug,
};