import request from '@/utils/request'

export interface Student {
  id: number
  username: string
  name: string
  score?: number
}

export interface Score {
  id: number
  studentId: number
  courseId: number
  score: number
  semester: string
}

export interface Course {
  id: number
  name: string
  code: string
  credit: number
  teacher: number
}

export const getTeacherCourses = () => {
  return request.get('/teacher/courses')
}

export const getCoursesWithStudents = () => {
  return request.get('/teacher/courses-with-students')
}

export const getCourseStudents = (courseId: number) => {
  return request.get(`/teacher/courses/${courseId}/students`)
}

export const updateStudentScore = (scoreData: { scores: Score[] }) => {
  return request.post('/teacher/scores', scoreData)
}

export const createCourse = (courseData: Omit<Course, 'id'>) => {
  return request.post('/teacher/courses', courseData)
}

export const recordAttendance = (data: { courseId: number, studentId: number, status: string }) => {
  return request.post('/teacher/attendance', data)
}

// 新增 API
export const getTeacherStats = () => {
  return request.get('/teacher/stats')
}

export const getScoreDistribution = () => {
  return request.get('/teacher/score-distribution')
}