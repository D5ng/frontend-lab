import { createApiClient } from '../../../src/api/client'
import type { BookingApi } from './types'
export function createBookingApi(): BookingApi {
  const request = createApiClient(),
    path = '/api/daily/2026-10-10-space-booking'
  return {
    getSpaces: () => request(path + '/spaces'),
    reserve: (input) => request(path + '/reservations', { method: 'POST', body: JSON.stringify(input) }),
  }
}
