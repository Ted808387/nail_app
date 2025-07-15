
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
    component: MyBookings
  },
  {
    path: '/account/settings',
    name: 'AccountSettings',
    component: AccountSettings
  },
  {
    path: '/admin',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/admin/calendar',
    name: 'BookingCalendar',
    component: BookingCalendar
  },
  {
    path: '/admin/services',
    name: 'ServiceManagement',
    component: ServiceManagement
  },
  {
    path: '/admin/clients',
    name: 'ClientManagement',
    component: ClientManagement
  },
  {
    path: '/admin/settings',
    name: 'BusinessSettings',
    component: BusinessSettings
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

export default router
