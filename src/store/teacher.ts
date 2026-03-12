import { defineStore } from 'pinia'

interface Course {
  id: number
  name: string
}

interface Student {
  id: number
  name: string
  score?: number
}

interface TeacherState {
  courses: Course[]
  students: Student[]
}

export const useTeacherStore = defineStore('teacher', {
  state: (): TeacherState => ({
    courses: [
      { id: 1, name: '高等数学' },
      { id: 2, name: '大学物理' }
    ],
    students: []
  }),
  actions: {
    getStudents(courseId: number) {
      if (courseId === 1) {
        this.students = [
          { id: 101, name: '李同学', score: 85 },
          { id: 102, name: '王同学', score: 92 }
        ]
      } else if (courseId === 2) {
        this.students = [
          { id: 101, name: '李同学', score: 78 },
          { id: 103, name: '张同学', score: 88 }
        ]
      }
    },
    submitScores() {
      return true
    }
  }
})