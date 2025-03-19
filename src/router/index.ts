import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: DefaultLayout,
      children: [
        {
          path: "",
          name: "Dashboard",
          component: DashboardView,
        },
        {
          path: '/user/:id',
          component: () => import('@/views/UserDetailsView.vue'),
        },

      ],
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();

        if (!authStore.loggedInUser) {
          next('/auth/login');
          return
        }

        next();
      }
    },
    {
      path: '/auth',
      name: 'Auth',
      component: AuthLayout,
      children: [
        { path: "login", component: () => import("@/views/auth/LoginView.vue") },
      ]
    },
  ],
})

export default router
