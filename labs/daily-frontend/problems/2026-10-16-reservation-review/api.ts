import { createApiClient } from '../../src/api/client'

export type Quote = { quoteId: string; count: number; totalPrice: number }
export type Receipt = { reservationId: string; count: number; totalPrice: number }
export interface ReservationApi {
  getQuote: (count: number) => Promise<Quote>
  confirm: (quoteId: string) => Promise<Receipt>
}

export function createReservationApi(): ReservationApi {
  const request = createApiClient()
  return {
    getQuote: (count) => request<Quote>('/api/daily/2026-10-16/quotes', { method: 'POST', body: JSON.stringify({ count }) }),
    confirm: (quoteId) => request<Receipt>('/api/daily/2026-10-16/reservations', { method: 'POST', body: JSON.stringify({ quoteId }) }),
  }
}
