import { createApiClient } from '../../../src/api/client'
import type { TripApi } from './types'
export function createTripApi(): TripApi {
  const request = createApiClient(),
    path = '/api/daily/2026-10-09-report-reasons'
  return {
    getPlaces: () => request(path + '/places'),
    save: (input) => request(path + '/trips', { method: 'POST', body: JSON.stringify(input) }),
  }
}
