import { RouteRecordRaw } from 'vue-router'

const adminRoutes: Array<RouteRecordRaw> = [
  {
    path: '/admin',
    name: 'AdminLayout',
    component: () => import('@/components/common/Layout.vue'), // 用Layout包裹
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboard.vue') // 指向views里的页面
      },
      {
        path: 'user-management',
        name: 'UserManagement',
        component: () => import('@/views/admin/UserManagement.vue')
      },
      {
        path: 'course-management',
        name: 'CourseManagement',
        component: () => import('@/views/admin/CourseManagement.vue')
      }
    ]
  }
]

export default adminRoutes