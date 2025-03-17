import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'DefaultLayout',
      component: DefaultLayout,
      children: [
        {
          path: "",
          component: DashboardView,
        },
        {
          path: '/user/:id',
          component: () => import('@/views/UserDetailsView.vue'),
        },

      ]
    },
    {
      path: '/auth',
      name: 'Auth',
      component: AuthLayout,
      children: [
        { path: "login", component: () => import("@/views/auth/LoginView.vue") },
        { path: "register", component: () => import("@/views/auth/RegisterView.vue") }
      ]
    },
  ],
})

export default router
