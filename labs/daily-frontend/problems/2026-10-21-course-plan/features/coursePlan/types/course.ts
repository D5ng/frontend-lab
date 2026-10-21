export interface Course {
  id: string
  title: string
  minutes: number
}

export type LoadCourses = () => Promise<Course[]>
