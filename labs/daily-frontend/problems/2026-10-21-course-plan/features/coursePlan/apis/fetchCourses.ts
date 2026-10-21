import type { createApiClient } from '../../../../../src/api/client'
import type { Course } from '../types/course'

export function fetchCourses(request: ReturnType<typeof createApiClient>) {
  return request<Course[]>('/api/daily/2026-10-21/courses')
}
