// src/services/dataService.js

// --- 預約數據 ---
const BOOKINGS_STORAGE_KEY = 'bookings';
const initialBookings = [
  { id: 1, clientName: '王小明', serviceName: '手部光療', date: '2025-07-15', time: '10:00', status: 'confirmed', notes: '客戶偏好亮色系' },
  { id: 2, clientName: '李美玲', serviceName: '日式嫁接睫毛', date: '2025-07-15', time: '14:00', status: 'pending', notes: '' },
  { id: 3, clientName: '張大華', serviceName: '頭皮深層護理', date: '2025-07-16', time: '09:00', status: 'confirmed', notes: '首次體驗' },
  { id: 4, clientName: '陳小花', serviceName: '美白保濕護膚', date: '2025-07-20', time: '11:30', status: 'confirmed', notes: '' },
  { id: 5, clientName: '林大同', serviceName: '足部深層保養', date: '2025-07-22', time: '16:00', status: 'pending', notes: '需提早10分鐘到' },
];

export function saveBookings(bookings) {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
}

export function loadBookings() {
  const storedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  return storedBookings ? JSON.parse(storedBookings) : initialBookings;
}

// --- 服務數據 ---
const SERVICES_STORAGE_KEY = 'services';
const initialServices = [
  { id: 1, name: '手部光療', description: '專業細緻的手部光療服務，包含基礎保養與多樣款式選擇。', price: 1200, duration: 90, category: '手部護理', isActive: true, imageUrl: 'https://via.placeholder.com/100?text=Hand+Gel' },
  { id: 2, name: '日式嫁接睫毛', description: '自然濃密的日式睫毛嫁接，採用輕柔手法，讓雙眼更有神。', price: 1800, duration: 120, category: '美睫', isActive: true, imageUrl: 'https://via.placeholder.com/100?text=Eyelash' },
  { id: 3, name: '頭皮深層護理', description: '深層清潔與滋養頭皮，改善髮質問題，讓您的頭皮重獲健康活力。', price: 900, duration: 60, category: '頭皮護理', isActive: false, imageUrl: 'https://via.placeholder.com/100?text=Scalp' },
  { id: 4, name: '美白保濕護膚', description: '針對肌膚暗沉與乾燥問題，提供深層美白與保濕護理。', price: 1500, duration: 90, category: '臉部護理', isActive: true, imageUrl: 'https://via.placeholder.com/100?text=Facial' },
  { id: 5, name: '足部深層保養', description: '專業足部去角質、修剪與滋潤，讓雙足恢復柔嫩。', price: 1000, duration: 60, category: '足部護理', isActive: true, imageUrl: 'https://via.placeholder.com/100?text=Foot' },
  { id: 6, name: '法式指甲', description: '經典法式指甲，簡約優雅，適合各種場合。', price: 800, duration: 75, category: '手部護理', isActive: true, imageUrl: 'https://via.placeholder.com/100?text=French+Nails' },
];

export function saveServices(services) {
  localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
}

export function loadServices() {
  const storedServices = localStorage.getItem(SERVICES_STORAGE_KEY);
  return storedServices ? JSON.parse(storedServices) : initialServices;
}

// --- 客戶數據 ---
const CLIENTS_STORAGE_KEY = 'clients';
const initialClients = [
  { id: 1, name: '陳小姐', email: 'chen@email.com', phone: '0911111111', registrationDate: '2023-01-15', totalBookings: 5, lastBookingDate: '2024-06-20' },
  { id: 2, name: '林先生', email: 'lin@email.com', phone: '0922222222', registrationDate: '2023-03-01', totalBookings: 12, lastBookingDate: '2024-07-10' },
  { id: 3, name: '王小姐', email: 'wang@email.com', phone: '0933333333', registrationDate: '2023-05-20', totalBookings: 8, lastBookingDate: '2024-07-01' },
  { id: 4, name: '張先生', email: 'zhang@email.com', phone: '0944444444', registrationDate: '2023-07-01', totalBookings: 3, lastBookingDate: '2024-05-15' },
];

export function saveClients(clients) {
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
}

export function loadClients() {
  const storedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
  return storedClients ? JSON.parse(storedClients) : initialClients;
}

// --- 營業設定數據 ---
const BUSINESS_SETTINGS_STORAGE_KEY = 'businessHours';
const HOLIDAYS_STORAGE_KEY = 'holidays';

const initialBusinessHours = [
  { id: 1, name: '星期一', open: '10:00', close: '19:00', isClosed: false },
  { id: 2, name: '星期二', open: '10:00', close: '19:00', isClosed: false },
  { id: 3, name: '星期三', open: '10:00', close: '19:00', isClosed: false },
  { id: 4, name: '星期四', open: '10:00', close: '19:00', isClosed: false },
  { id: 5, name: '星期五', open: '10:00', close: '19:00', isClosed: false },
  { id: 6, name: '星期六', open: '10:00', close: '19:00', isClosed: false },
  { id: 7, name: '星期日', open: '10:00', close: '19:00', isClosed: true },
];

const initialHolidays = [
  '2025-01-01', // 元旦
  '2025-02-08', // 農曆新年
];

export function saveBusinessHours(hours) {
  localStorage.setItem(BUSINESS_SETTINGS_STORAGE_KEY, JSON.stringify(hours));
}

export function loadBusinessHours() {
  const storedHours = localStorage.getItem(BUSINESS_SETTINGS_STORAGE_KEY);
  return storedHours ? JSON.parse(storedHours) : initialBusinessHours;
}

export function saveHolidays(holidays) {
  localStorage.setItem(HOLIDAYS_STORAGE_KEY, JSON.stringify(holidays));
}

export function loadHolidays() {
  const storedHolidays = localStorage.getItem(HOLIDAYS_STORAGE_KEY);
  return storedHolidays ? JSON.parse(storedHolidays) : initialHolidays;
}

// --- 用戶數據 ---
const USERS_STORAGE_KEY = 'users';
const initialUsers = [
  { id: 1, name: '範例使用者', email: 'user@example.com', phone: '0912345678', password: 'user123', role: 'customer', registrationDate: '2023-01-01' },
  { id: 2, name: '管理員', email: 'admin@example.com', phone: '0987654321', password: 'admin123', role: 'admin', registrationDate: '2023-01-01' },
];

export function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function loadUsers() {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  return storedUsers ? JSON.parse(storedUsers) : initialUsers;
}