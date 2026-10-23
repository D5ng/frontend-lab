import type { createApiClient } from '../../../../../src/api/client'
import type { Destination, Route } from '../types/route'

export function fetchRoutes(request: ReturnType<typeof createApiClient>, destination: Destination) {
  const query = new URLSearchParams({ destination })
  return request<Route[]>(`/api/daily/2026-10-23/routes?${query}`)
}
