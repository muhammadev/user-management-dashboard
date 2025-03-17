import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

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
          component: () => import('../views/UserDetailsView.vue'),
        },

      ]
    },
  ],
})

export default router
