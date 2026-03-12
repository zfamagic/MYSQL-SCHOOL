import { RouteRecordRaw } from 'vue-router'

const studentRoutes: Array<RouteRecordRaw> = [
  {
    path: '/student',
    name: 'StudentLayout',
    component: () => import('@/components/common/Layout.vue'), // 用Layout包裹
    meta: { requiresAuth: true, role: 'student' },
    children: [
      {
        path: 'dashboard',
        name: 'StudentDashboard',
        component: () => import('@/views/student/StudentDashboard.vue')
      },
      {
        path: 'course-selection',
        name: 'CourseSelection',
        component: () => import('@/views/student/CourseSelection.vue')
      },
      {
        path: 'score-query',
        name: 'ScoreQuery',
        component: () => import('@/views/student/ScoreQuery.vue')
      }
    ]
  }
]

export default studentRoutes