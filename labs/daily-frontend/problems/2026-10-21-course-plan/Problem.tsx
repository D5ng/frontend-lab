import { useState } from 'react'
import { createApiClient } from '../../src/api/client'
import { fetchCourses } from './features/coursePlan/apis/fetchCourses'
import { CoursePlanPage } from './pages/CoursePlanPage'

export function Problem() {
  const [loadCourses] = useState(() => {
    const request = createApiClient()
    return () => fetchCourses(request)
  })
  return <CoursePlanPage loadCourses={loadCourses} />
}
