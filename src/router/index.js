import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/public/LandingPage.vue'
import ServiceList from '../views/public/ServiceList.vue'
import SignUp from '../views/public/SignUp.vue'
import SignIn from '../views/public/SignIn.vue'
import BookingFlow from '../views/customer/BookingFlow.vue'
import MyBookings from '../views/customer/MyBookings.vue'
import AccountSettings from '../views/customer/AccountSettings.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import BookingCalendar from '../views/admin/BookingCalendar.vue'
import ServiceManagement from '../views/admin/ServiceManagement.vue'
import ClientManagement from '../views/admin/ClientManagement.vue'
import BusinessSettings from '../views/admin/BusinessSettings.vue'
import AdminSetup from '../views/admin/AdminSetup.vue'

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },
  {
    path: '/services',
    name: 'ServiceList',
    component: ServiceList
  },
  {
    path: '/account/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/account/signin',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/booking',
    name: 'BookingFlow',
    component: BookingFlow
  },
  {
    path: '/my-bookings',
    name: 'MyBookings',
    component: MyBookings,
    meta: { requiresAuth: true } // 需要登入
  },
  {
    path: '/account/settings',
    name: 'AccountSettings',
    component: AccountSettings,
    meta: { requiresAuth: true } // 需要登入
  },
  {
    path: '/admin',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, requiresAdmin: true } // 需要登入且為管理員
  },
  {
    path: '/admin/calendar',
    name: 'BookingCalendar',
    component: BookingCalendar,
    meta: { requiresAuth: true, requiresAdmin: true } // 需要登入且為管理員
  },
  {
    path: '/admin/services',
    name: 'ServiceManagement',
    component: ServiceManagement,
    meta: { requiresAuth: true, requiresAdmin: true } // 需要登入且為管理員
  },
  {
    path: '/admin/clients',
    name: 'ClientManagement',
    component: ClientManagement,
    meta: { requiresAuth: true, requiresAdmin: true } // 需要登入且為管理員
  },
  
  
  {
    path: '/admin/settings',
    name: 'BusinessSettings',
    component: BusinessSettings,
    meta: { requiresAuth: true, requiresAdmin: true } // 需要登入且為管理員
  },
  {
    path: '/admin-setup',
    name: 'AdminSetup',
    component: AdminSetup
  },
  // Catch-all route for 404 - redirect to home
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 全局導航守衛
import { useAuthStore } from '../stores/auth'; // 導入 Pinia 的 auth store

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore(); // 獲取 auth store 實例

  // 確保 auth 狀態已載入
  if (!authStore.currentUserId && localStorage.getItem('currentUserId')) {
    await authStore.checkAuthStatus();
  }

  const isAuthenticated = authStore.isLoggedIn;
  const isAdmin = authStore.isAdmin;

  // 如果已登入，且嘗試訪問登入或註冊頁面，則重定向
  if (isAuthenticated && (to.path === '/account/signin' || to.path === '/account/signup')) {
    if (isAdmin) {
      next('/admin'); // 管理員導向管理員儀表板
    } else {
      next('/my-bookings'); // 普通用戶導向我的預約
    }
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    // 如果需要登入但未登入，導向登入頁
    next('/account/signin');
  } else if (to.meta.requiresAdmin && !isAdmin) {
    // 如果需要管理員權限但不是管理員，導向首頁或客戶預約頁
    next('/'); // 或者 next('/my-bookings');
  } else {
    next(); // 允許導航
  }
});

export default router