import { defineStore } from 'pinia'

interface UserInfo {
  id: number
  username: string
  role: 'admin' | 'teacher' | 'student'
  name: string
}

interface AuthState {
  token: string | null
  userInfo: UserInfo | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null')
  }),
  actions: {
    /**
     * 模拟登录（前端直接验证）
     */
    login(username: string, password: string, role: 'admin' | 'teacher' | 'student') {
      if ((username === 'admin' && password === '123456' && role === 'admin') ||
          (username === 'teacher' && password === '123456' && role === 'teacher') ||
          (username === 'student' && password === '123456' && role === 'student')) {
        const token = 'mock-token-' + Date.now()
        const userInfo: UserInfo = {
          id: role === 'admin' ? 1 : role === 'teacher' ? 2 : 3,
          username,
          role,
          name: role === 'admin' ? '系统管理员' : role === 'teacher' ? '张老师' : '李同学'
        }
        this.token = token
        this.userInfo = userInfo
        localStorage.setItem('token', token)
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        return true
      } else {
        return false
      }
    },

    /**
     * 从后端登录成功后保存 token
     */
    setToken(token: string | null) {
      this.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },

    /**
     * 从后端登录成功后保存用户信息
     */
    setUserInfo(userInfo: UserInfo | null) {
      this.userInfo = userInfo
      if (userInfo) {
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
      } else {
        localStorage.removeItem('userInfo')
      }
    },

    /**
     * 登出
     */
    logout() {
      this.token = null
      this.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }
})