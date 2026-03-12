import request from '@/utils/request'

export interface LoginData {
  username: string
  password: string
  role: 'admin' | 'teacher' | 'student'
}

export const login = (data: LoginData) => {
  return request.post('/auth/login', data)
}

export const logout = () => {
  return request.post('/auth/logout')
}

export const getCurrentUser = () => {
  return request.get('/auth/user')
}