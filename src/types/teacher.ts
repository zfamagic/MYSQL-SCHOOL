export interface Course {
  id: number
  name: string
}

export interface Student {
  id: number
  name: string
  score?: number
}

export interface Score {
  studentId: number
  courseId: number
  score: number
}