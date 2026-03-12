import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/auth'
import { pinia } from '@/main'

// 定义后端返回的错误数据结构
interface ApiErrorData {
  message?: string
  [key: string]: any // 允许其他字段
}

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api', // 强制指定后端地址（避免.env配置错）
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore(pinia)
    // 强制打印 Token（调试用）
    console.log('当前 Token:', authStore.token)
    if (authStore.token) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${authStore.token}`
    }
    return config
  },
  (error: AxiosError) => {
    console.error('请求发送失败:', error)
    ElMessage.error('请求发送失败，请稍后再试')
    return Promise.reject(error)
  }
)

// 响应拦截器（简化逻辑，避免无code字段的误判）
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    const url = response.config.url || ''
    console.log(`接口 ${url} 返回:`, res) // 调试：打印所有接口返回

    // 登录接口特殊处理
    if (url.includes('/auth/login') && res.token) {
      return res
    }

    // 其他接口直接返回（后端返回数组/对象都兼容）
    return res
  },
  (error: AxiosError) => {
    console.error('响应错误:', error)
    const errData = error.response?.data as ApiErrorData
    const errMsg = errData?.message || error.message || '请求失败'
    const status = error.response?.status

    // 401 未授权 → 登出并跳登录
    if (status === 401) {
      const authStore = useAuthStore(pinia)
      authStore.logout()
      window.location.href = '/login'
      ElMessage.error('登录已过期，请重新登录')
    } else {
      ElMessage.error(errMsg)
    }

    return Promise.reject(error)
  }
)

export default service