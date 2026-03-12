import { RouteRecordRaw } from 'vue-router'

const teacherRoutes: Array<RouteRecordRaw> = [
  {
    path: '/teacher',
    name: 'TeacherLayout',
    component: () => import('@/components/common/Layout.vue'), // 用Layout包裹
    meta: { requiresAuth: true, role: 'teacher' },
    children: [
      {
        path: 'dashboard',
        name: 'TeacherDashboard',
        component: () => import('@/views/teacher/TeacherDashboard.vue')
      },
      {
        path: 'score-entry',
        name: 'ScoreEntry',
        component: () => import('@/views/teacher/ScoreEntry.vue')
      },
      {
        path: 'teaching-schedule',
        name: 'TeachingSchedule',
        component: () => import('@/views/teacher/TeachingSchedule.vue')
      },
      {
        path: 'course-creation',
        name: 'TeacherCourseCreation',
        component: () => import('@/views/teacher/CourseCreation.vue')
      }
    ]
  }
]

export default teacherRoutes