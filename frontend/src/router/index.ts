import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '@/pages/DashboardPage.vue'
import VendorsPage from '@/pages/VendorsPage.vue'
import ArchivedVendorsPage from '@/pages/ArchivedVendorsPage.vue'
import VendorDetailsPage from '@/pages/VendorDetailsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardPage },
    { path: '/vendors', name: 'vendors', component: VendorsPage },
    { path: '/vendors/archived', name: 'vendorsArchived', component: ArchivedVendorsPage },
    { path: '/vendors/:id', name: 'vendorDetails', component: VendorDetailsPage },
  ],
})

export default router
