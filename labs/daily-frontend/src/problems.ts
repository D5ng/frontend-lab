import { Problem as AsyncSearch } from '../problems/2026-09-30-async-search/Problem'
import { Problem as OrderBoundaries } from '../problems/2026-10-01-order-boundaries/Problem'
import { Problem as ReservationPolicy } from '../problems/2026-10-03-reservation-policy/Problem'

export const problems = [
  { id: '2026-09-30-async-search', title: '늦게 도착한 검색 결과', Component: AsyncSearch },
  { id: '2026-10-01-order-boundaries', title: '배송과 픽업, 어디까지 함께 둘까?', Component: OrderBoundaries },
  { id: '2026-10-03-reservation-policy', title: '예약 취소 정책의 변경 경계', Component: ReservationPolicy },
]
