import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import adminRoutes from './admin'
import teacherRoutes from './teacher'
import studentRoutes from './student'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  ...adminRoutes,
  ...teacherRoutes,
  ...studentRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !authStore.token) {
    next('/login')
  } else if (requiresAuth && authStore.token) {
    const role = authStore.userInfo?.role
    if (role && to.path.startsWith(`/${role}`)) {
      next()
    } else if (role) {
      next(`/${role}/dashboard`)
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router