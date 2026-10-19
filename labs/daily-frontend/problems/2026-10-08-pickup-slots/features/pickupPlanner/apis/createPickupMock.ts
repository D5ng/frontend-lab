import { createApiClient } from '../../../../../src/api/client'
import type { Slot, LoadSlots, ReserveSlot } from '../types/pickup'

// HTTP 응답 모킹은 handlers.ts에 두고 기존 함수 주입 계약을 유지한다.
export function createPickupMock(): { loadSlots: LoadSlots; reserveSlot: ReserveSlot } {
  const request = createApiClient()
  return {
    loadSlots: (day) => request<Slot[]>(`/api/daily/2026-10-08-pickup-slots/slots?day=${day}`),
    reserveSlot: (reservation) =>
      request('/api/daily/2026-10-08-pickup-slots/reservations', { method: 'POST', body: JSON.stringify(reservation) }),
  }
}
