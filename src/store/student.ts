import { defineStore } from 'pinia'
import { getAvailableCourses, getSelectedCourses, getStudentScores } from '@/api/student'

// 基础课程类型
interface Course {
  id: number
  name: string
  code: string
  credit: number
  teacherName: string
  current_student?: number
}

// 已选课程（在基础课程上增加选课时间）
interface SelectedCourse extends Course {
  selectedTime: string
}

// 成绩类型
interface Score {
  courseName: string
  courseCode: string
  credit: number
  score: number
  semester: string
}

// 定义 store 状态
interface StudentState {
  availableCourses: Course[]
  selectedCourses: SelectedCourse[]
  scores: Score[]
}

export const useStudentStore = defineStore('student', {
  state: (): StudentState => ({
    availableCourses: [],
    selectedCourses: [],
    scores: []
  }),
  actions: {
    async fetchAvailableCourses() {
      try {
        const res = await getAvailableCourses()
        const data = Array.isArray(res) ? res : res.data || []

        // ✅ 给 map 的参数加上类型
        this.availableCourses = data.map((c: Partial<Course> & Record<string, any>) => ({
          id: c.id,
          name: c.name,
          code: c.code,
          credit: c.credit,
          teacherName: c.teacherName || c.teacher_name || '',
          current_student: c.current_student || 0
        }))
      } catch (err) {
        console.error('获取可选课程失败:', err)
      }
    },

    async fetchSelectedCourses() {
      try {
        const res = await getSelectedCourses()
        const data = Array.isArray(res) ? res : res.data || []

        // ✅ 给 map 的参数加上类型
        this.selectedCourses = data.map((c: Partial<SelectedCourse> & Record<string, any>) => ({
          id: c.id,
          name: c.name,
          code: c.code,
          credit: c.credit,
          teacherName: c.teacherName || c.teacher_name || '',
          selectedTime: c.selectedTime || c.selected_time || '',
          current_student: c.current_student || 0
        }))
      } catch (err) {
        console.error('获取已选课程失败:', err)
      }
    },

    async fetchScores() {
      try {
        const res = await getStudentScores()
        const data = Array.isArray(res) ? res : res.data || []

        // ✅ 给 map 的参数加上类型
        this.scores = data.map((s: Partial<Score> & Record<string, any>) => ({
          courseName: s.courseName || '',
          courseCode: s.courseCode || '',
          credit: s.credit || 0,
          score: s.score || 0,
          semester: s.semester || ''
        }))
      } catch (err) {
        console.error('获取成绩失败:', err)
      }
    },

    selectCourse(courseId: number) {
      const course = this.availableCourses.find(c => c.id === courseId)
      if (course) {
        this.selectedCourses.push({
          ...course,
          selectedTime: new Date().toLocaleString()
        })
        this.availableCourses = this.availableCourses.filter(c => c.id !== courseId)
      }
    }
  },
  getters: {
    selectedCourseCount: state => state.selectedCourses.length,

    // ✅ 给 reduce 的参数加上类型
    completedCredits: state =>
      state.selectedCourses.reduce((sum: number, c: SelectedCourse) => sum + (c.credit || 0), 0),

    averageScore: state => {
      if (state.scores.length === 0) return '0.00'
      // ✅ 给 reduce 的参数加上类型
      const total = state.scores.reduce((sum: number, s: Score) => sum + s.score, 0)
      return (total / state.scores.length).toFixed(2)
    }
  }
})