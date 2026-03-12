import request from '@/utils/request'

export const getAvailableCourses = () => {
  return request.get('/student/courses/available')
}

export const selectCourse = (courseId: number) => {
  return request.post('/student/courses/select', { courseId })
}

export const dropCourse = (courseId: number) => {
  return request.delete(`/student/courses/${courseId}`)
}

export const getSelectedCourses = () => {
  return request.get('/student/courses/selected')
}

export const getStudentScores = () => {
  return request.get('/student/scores')
}