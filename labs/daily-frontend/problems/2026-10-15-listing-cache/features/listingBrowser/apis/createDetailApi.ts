import { createApiClient } from '../../../../../src/api/client'
import type { ListingDetail, LoadDetail } from '../types/listing'

export function createDetailApi(): LoadDetail {
  const request = createApiClient()
  return (id) => request<ListingDetail | null>(`/api/daily/2026-10-15/listings/${id}`)
}
