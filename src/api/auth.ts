import request from '@/utils/request'

export interface LoginData {
  username: string
  password: string
  role: 'admin' | 'teacher' | 'student'
}

export const authApi = {
  login: (data: LoginData) => {
    return request.post('/auth/login', data)
  },
  logout: () => {
    return request.post('/auth/logout')
  },
  getCurrentUser: () => {
    return request.get('/auth/user')
  }
}