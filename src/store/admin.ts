import { defineStore } from 'pinia'
import { getCourses, getUsers } from '@/api/admin'

interface User {
  id: number
  username: string
  password: string
  role: 'admin' | 'teacher' | 'student'
  name: string
}

interface Course {
  id: number
  name: string
  code: string
  credit: number
  teacher: number
}

interface AdminState {
  users: User[]
  courses: Course[]
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    users: [],
    courses: []
  }),
  actions: {
    async fetchUsers() {
      try {
        const res = await getUsers()
        this.users = Array.isArray(res) ? res : res.data || []
      } catch (error) {
        console.error('获取用户失败:', error)
      }
    },
    async fetchCourses() {
      try {
        const res = await getCourses()
        this.courses = Array.isArray(res) ? res : res.data || []
      } catch (error) {
        console.error('获取课程失败:', error)
      }
    },
    addUser(user: User) {
      user.id = Date.now()
      this.users.push(user)
    },
    updateUser(user: User) {
      const index = this.users.findIndex(u => u.id === user.id)
      if (index !== -1) {
        this.users[index] = user
      }
    },
    deleteUser(id: number) {
      this.users = this.users.filter(u => u.id !== id)
    },
    addCourse(course: Course) {
      course.id = Date.now()
      this.courses.push(course)
    },
    updateCourse(course: Course) {
      const index = this.courses.findIndex(c => c.id === course.id)
      if (index !== -1) {
        this.courses[index] = course
      }
    },
    deleteCourse(id: number) {
      this.courses = this.courses.filter(c => c.id !== id)
    }
  }
})