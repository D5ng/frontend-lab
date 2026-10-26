import { Problem as AsyncSearch } from '../problems/2026-09-30-async-search/Problem'
import { Problem as OrderBoundaries } from '../problems/2026-10-01-order-boundaries/Problem'
import { Problem as SavedInstructions } from '../problems/2026-10-02-saved-instructions/Problem'
import { Problem as ReservationPolicy } from '../problems/2026-10-03-reservation-policy/Problem'
import { Problem as NeighborhoodFeed } from '../problems/2026-10-04-neighborhood-feed/Problem'
import { Problem as FilteredSelection } from '../problems/2026-10-05-filtered-selection/Problem'
import { Problem as SaveSnapshot } from '../problems/2026-10-06-save-snapshot/Problem'
import { Problem as NotificationRollback } from '../problems/2026-10-07-notification-rollback/Problem'

export const problems = [
  { id: '2026-09-30-async-search', title: '늦게 도착한 검색 결과', Component: AsyncSearch },
  { id: '2026-10-01-order-boundaries', title: '배송과 픽업, 어디까지 함께 둘까?', Component: OrderBoundaries },
  { id: '2026-10-02-saved-instructions', title: '작성 중인 안내와 저장된 안내', Component: SavedInstructions },
  { id: '2026-10-03-reservation-policy', title: '예약 취소 정책의 변경 경계', Component: ReservationPolicy },
  { id: '2026-10-04-neighborhood-feed', title: '빠른 동네 선택과 늦은 게시글', Component: NeighborhoodFeed },
  { id: '2026-10-05-filtered-selection', title: '숨겨진 상품도 선택한 상품일까?', Component: FilteredSelection },
  { id: '2026-10-06-save-snapshot', title: '저장 중에 새로 쓴 메모', Component: SaveSnapshot },
  { id: '2026-10-07-notification-rollback', title: '하나의 알림 실패가 다른 상품을 바꾸지 않게', Component: NotificationRollback },
]
