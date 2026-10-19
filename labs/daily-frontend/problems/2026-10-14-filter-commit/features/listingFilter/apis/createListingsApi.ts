import { createApiClient } from '../../../../../src/api/client'
import type { Listing, SearchListings } from '../types/listing'

export function createListingsApi(): SearchListings {
  const request = createApiClient()
  return (selected) =>
    request<Listing[]>('/api/daily/2026-10-14/listings', {
      method: 'POST',
      body: JSON.stringify({ categories: selected }),
    })
}
