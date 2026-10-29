export type ReservationId = 'tomorrow' | 'today' | 'started'
export type ReservationTiming = 'before-day' | 'same-day' | 'started'

export interface Reservation {
  id: ReservationId
  title: string
  timing: ReservationTiming
  paid: number
}

export const INITIAL_RESERVATIONS: Reservation[] = [
  { id: 'tomorrow', title: '내일 · 도자기 원데이 클래스', timing: 'before-day', paid: 12000 },
  { id: 'today', title: '오늘 · 가죽 키링 클래스', timing: 'same-day', paid: 18000 },
  { id: 'started', title: '진행 중 · 수채화 클래스', timing: 'started', paid: 15000 },
] as const

/* 예약 목록에 있는 예약 id인지 판별하는 함수 */
export function isReservationId(value: string): value is ReservationId {
  return INITIAL_RESERVATIONS.some((reservation) => reservation.id === value)
}
