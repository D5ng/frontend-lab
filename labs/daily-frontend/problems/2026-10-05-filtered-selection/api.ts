import { createApiClient } from '../../src/api/client'

export const products = [
  { id: 'desk', title: '접이식 책상', price: 12000 },
  { id: 'books', title: '소설책 세 권', price: 5000 },
  { id: 'plant', title: '작은 화분', price: 0 },
] as const

export type Reservation = { productIds: string[]; totalPrice: number }
export type ReserveProducts = (reservation: Reservation) => Promise<void>

// HTTP 응답 모킹은 handlers.ts에 두고 기존 함수 주입 계약을 유지한다.
export function createDemoReservation(): ReserveProducts {
  const request = createApiClient()
  return (reservation) =>
    request('/api/daily/2026-10-05-filtered-selection/reservations', { method: 'POST', body: JSON.stringify(reservation) })
}
