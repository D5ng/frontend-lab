import { createApiClient } from '../../../../../src/api/client'
import type { RemovalApi } from '../types/product'

export function createRemovalApi(): RemovalApi {
  const request = createApiClient()
  return {
    remove: (id) => request(`/api/daily/2026-10-19/items/${id}`, { method: 'DELETE' }),
    restore: (id) => request(`/api/daily/2026-10-19/items/${id}/restore`, { method: 'POST' }),
  }
}
