import { createApiClient } from '../../../../../src/api/client'
import type { Quote, Receipt, ReservationApi } from '../types/reservation'

export function createReservationApi(): ReservationApi {
  const request = createApiClient()
  return {
    getQuote: (count) => request<Quote>('/api/daily/2026-10-16/quotes', { method: 'POST', body: JSON.stringify({ count }) }),
    confirm: (quoteId) => request<Receipt>('/api/daily/2026-10-16/reservations', { method: 'POST', body: JSON.stringify({ quoteId }) }),
  }
}
