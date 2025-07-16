// src/api/index.js
import * as dataService from '../services/dataService';

// 模擬網路延遲
const simulateDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// --- 預約 API ---
export const fetchBookings = async () => {
  await simulateDelay();
  return dataService.loadBookings();
};

export const saveBooking = async (booking) => {
  await simulateDelay();
  const bookings = dataService.loadBookings();
  if (booking.id) {
    // Update existing booking
    const index = bookings.findIndex(b => b.id === booking.id);
    if (index !== -1) {
      bookings[index] = { ...booking };
    } else {
      throw new Error('Booking not found for update.');
    }
  } else {
    // Add new booking
    booking.id = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
    bookings.push(booking);
  }
  dataService.saveBookings(bookings);
  return booking;
};

export const deleteBooking = async (id) => {
  await simulateDelay();
  let bookings = dataService.loadBookings();
  const initialLength = bookings.length;
  bookings = bookings.filter(b => b.id !== id);
  dataService.saveBookings(bookings);
  if (bookings.length === initialLength) {
    throw new Error('Booking not found for deletion.');
  }
  return { success: true };
};

// --- 服務 API ---
export const fetchServices = async () => {
  await simulateDelay();
  return dataService.loadServices();
};

export const saveService = async (service) => {
  await simulateDelay();
  const services = dataService.loadServices();
  if (service.id) {
    const index = services.findIndex(s => s.id === service.id);
    if (index !== -1) {
      services[index] = { ...service };
    } else {
      throw new Error('Service not found for update.');
    }
  } else {
    service.id = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
    services.push(service);
  }
  dataService.saveServices(services);
  return service;
};

export const updateServiceStatus = async (serviceId, isActive) => {
  await simulateDelay();
  const services = dataService.loadServices();
  const service = services.find(s => s.id === serviceId);
  if (service) {
    service.isActive = isActive;
    dataService.saveServices(services);
    return service;
  } else {
    throw new Error('Service not found.');
  }
};

export const deleteServiceApi = async (id) => { // Renamed to avoid conflict with component function
  await simulateDelay();
  let services = dataService.loadServices();
  const initialLength = services.length;
  services = services.filter(s => s.id !== id);
  dataService.saveServices(services);
  if (services.length === initialLength) {
    throw new Error('Service not found for deletion.');
  }
  return { success: true };
};

export const bulkServiceAction = async (action, serviceIds) => {
  await simulateDelay(1200); // Longer delay for bulk action
  const services = dataService.loadServices();
  serviceIds.forEach(id => {
    const service = services.find(s => s.id === id);
    if (service) {
      if (action === 'activate') {
        service.isActive = true;
      } else if (action === 'deactivate') {
        service.isActive = false;
      } else if (action === 'delete') {
        // Mark for deletion, then filter outside loop
      }
    }
  });
  let updatedServices = services;
  if (action === 'delete') {
    updatedServices = services.filter(s => !serviceIds.includes(s.id));
  }
  dataService.saveServices(updatedServices);
  return { success: true, message: `Selected services ${action}d successfully.` };
};


// --- 客戶 API ---
export const fetchClients = async () => {
  await simulateDelay();
  return dataService.loadClients();
};

export const fetchClientById = async (id) => {
  await simulateDelay();
  const clients = dataService.loadClients();
  const client = clients.find(c => c.id === id);
  if (!client) {
    throw new Error('Client not found.');
  }
  return client;
};

export const updateClient = async (client) => {
  await simulateDelay();
  const clients = dataService.loadClients();
  const index = clients.findIndex(c => c.id === client.id);
  if (index !== -1) {
    clients[index] = { ...client };
    dataService.saveClients(clients);
    return client;
  } else {
    throw new Error('Client not found for update.');
  }
};

// --- 營業設定 API ---
export const fetchBusinessSettings = async () => {
  await simulateDelay();
  return {
    businessHours: dataService.loadBusinessHours(),
    holidays: dataService.loadHolidays(),
  };
};

export const saveBusinessSettings = async (settings) => {
  await simulateDelay();
  dataService.saveBusinessHours(settings.businessHours);
  dataService.saveHolidays(settings.holidays);
  return { success: true };
};

export const addHoliday = async (holidayDate) => {
  await simulateDelay();
  const holidays = dataService.loadHolidays();
  if (holidays.includes(holidayDate)) {
    throw new Error('Holiday already exists.');
  }
  holidays.push(holidayDate);
  dataService.saveHolidays(holidays);
  return { success: true, holiday: holidayDate };
};

export const removeHoliday = async (holidayDate) => {
  await simulateDelay();
  let holidays = dataService.loadHolidays();
  const initialLength = holidays.length;
  holidays = holidays.filter(h => h !== holidayDate);
  dataService.saveHolidays(holidays);
  if (holidays.length === initialLength) {
    throw new Error('Holiday not found for removal.');
  }
  return { success: true };
};

// --- 用戶認證 API ---
export const registerUser = async (userData) => {
  await simulateDelay();
  const users = dataService.loadUsers();
  if (users.some(user => user.email === userData.email)) {
    throw new Error('Email already registered.');
  }
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    ...userData,
    registrationDate: new Date().toISOString().split('T')[0],
  };
  users.push(newUser);
  dataService.saveUsers(users);
  return newUser;
};

export const loginUser = async (email, password) => {
  await simulateDelay();
  const users = dataService.loadUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Invalid email or password.');
  }
  return user;
};

export const fetchUserById = async (id) => {
  await simulateDelay();
  const users = dataService.loadUsers();
  const user = users.find(u => u.id === id);
  if (!user) {
    throw new Error('User not found.');
  }
  return user;
};

export const updateUserProfile = async (userProfile) => {
  await simulateDelay();
  const users = dataService.loadUsers();
  const index = users.findIndex(u => u.id === userProfile.id);
  if (index !== -1) {
    users[index] = { ...users[index], ...userProfile }; // Merge updated fields
    dataService.saveUsers(users);
    return users[index];
  } else {
    throw new Error('User not found for update.');
  }
};

export const changeUserPassword = async (userId, currentPassword, newPassword) => {
  await simulateDelay();
  const users = dataService.loadUsers();
  const user = users.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found.');
  }
  if (user.password !== currentPassword) {
    throw new Error('Current password incorrect.');
  }
  user.password = newPassword; // In real app, hash new password
  dataService.saveUsers(users);
  return { success: true };
};
