import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '@/pages/DashboardPage.vue'
import VendorsPage from '@/pages/VendorsPage.vue'
import ArchivedVendorsPage from '@/pages/ArchivedVendorsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardPage },
    { path: '/vendors', name: 'vendors', component: VendorsPage },
    { path: '/vendors/archived', name: 'vendorsArchived', component: ArchivedVendorsPage },
  ],
})

export default router
