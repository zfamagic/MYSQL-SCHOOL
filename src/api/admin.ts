import request from '@/utils/request'

export interface User {
  id: number
  username: string
  password: string
  name: string
  role: 'admin' | 'teacher' | 'student'
}

export interface Course {
  id: number
  name: string
  code: string
  credit: number
  teacher: number
}

export const getUsers = () => {
  return request.get('/admin/users')
}

export const createUser = (userData: Omit<User, 'id'>) => {
  return request.post('/admin/users', userData)
}

export const updateUser = (id: number, userData: Partial<User>) => {
  return request.put(`/admin/users/${id}`, userData)
}

export const deleteUser = (id: number) => {
  return request.delete(`/admin/users/${id}`)
}

export const getCourses = () => {
  return request.get('/admin/courses')
}

export const createCourse = (courseData: Omit<Course, 'id'>) => {
  return request.post('/admin/courses', courseData)
}

export const updateCourse = (id: number, courseData: Partial<Course>) => {
  return request.put(`/admin/courses/${id}`, courseData)
}

// 删除课程 API
export const deleteCourse = (id: number) => {
  return request.delete(`/admin/courses/${id}`)
}