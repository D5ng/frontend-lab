import { createApiClient } from '../../src/api/client'

export type Day = 'today' | 'tomorrow'
export type Slot = { id: string; label: string }
export type LoadSlots = (day: Day) => Promise<Slot[]>
export type ReserveSlot = (request: { day: Day; slotId: string }) => Promise<void>
export const slotsByDay: Record<Day, Slot[]> = {
  today: [
    { id: 'today-18', label: '오후 6시' },
    { id: 'today-19', label: '오후 7시' },
  ],
  tomorrow: [
    { id: 'tomorrow-10', label: '오전 10시' },
    { id: 'tomorrow-11', label: '오전 11시' },
  ],
}

// HTTP 응답 모킹은 handlers.ts에 두고 기존 함수 주입 계약을 유지한다.
export function createPickupMock(): { loadSlots: LoadSlots; reserveSlot: ReserveSlot } {
  const request = createApiClient()
  return {
    loadSlots: (day) => request<Slot[]>(`/api/daily/2026-10-08-pickup-slots/slots?day=${day}`),
    reserveSlot: (reservation) =>
      request('/api/daily/2026-10-08-pickup-slots/reservations', { method: 'POST', body: JSON.stringify(reservation) }),
  }
}
