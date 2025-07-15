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
    path: '/admin/clients/:id',
    name: 'ClientDetail',
    component: () => import('../views/admin/ClientDetail.vue'), // 動態載入組件
    meta: { requiresAuth: true, requiresAdmin: true } // 需要登入且為管理員
  },
  {
    path: '/admin/bookings/:id', // 新增預約詳情路由
    name: 'BookingDetail',
    component: () => import('../views/admin/BookingDetail.vue'), // 動態載入組件
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
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('currentUserId') !== null;
  const currentUserRole = localStorage.getItem('currentUserRole');

  if (to.meta.requiresAuth && !isLoggedIn) {
    // 如果需要登入但未登入，導向登入頁
    next('/account/signin');
  } else if (to.meta.requiresAdmin && currentUserRole !== 'admin') {
    // 如果需要管理員權限但不是管理員，導向首頁或客戶預約頁
    next('/'); // 或者 next('/my-bookings');
  } else {
    next(); // 允許導航
  }
});

export default router