import { createApiClient } from '../../../../../src/api/client'
import type { ReserveProducts } from '../types/reservation'

// HTTP 응답 모킹은 handlers.ts에 두고 기존 함수 주입 계약을 유지한다.
export function createDemoReservation(): ReserveProducts {
  const request = createApiClient()
  return (reservation) =>
    request('/api/daily/2026-10-05-filtered-selection/reservations', { method: 'POST', body: JSON.stringify(reservation) })
}
