export interface Course {
  id: number
  name: string
  code: string
  credit: number
  teacherName: string
}

export interface SelectedCourse {
  id: number
  name: string
  code: string
  credit: number
  teacherName: string
  selectedTime: string
}

export interface Score {
  courseName: string
  courseCode: string
  credit: number
  score: number
  semester: string
}