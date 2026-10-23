import { useState } from 'react'
import { createApiClient } from '../../src/api/client'
import { fetchRoutes } from './features/routePlanner/apis/fetchRoutes'
import type { Destination } from './features/routePlanner/types/route'
import { RoutePlannerPage } from './pages/RoutePlannerPage'

export function Problem() {
  const [loadRoutes] = useState(() => {
    const request = createApiClient()
    return (destination: Destination) => fetchRoutes(request, destination)
  })
  return <RoutePlannerPage loadRoutes={loadRoutes} />
}
