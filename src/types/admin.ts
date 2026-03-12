export interface User {
  id: number
  username: string
  password: string
  role: 'admin' | 'teacher' | 'student'
  name: string
}

export interface Course {
  id: number
  name: string
  code: string
  credit: number
  teacher: number
}