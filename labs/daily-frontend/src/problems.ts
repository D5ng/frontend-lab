import { Problem as AsyncSearch } from '../problems/2026-09-30-async-search/Problem'
import { Problem as OrderBoundaries } from '../problems/2026-10-01-order-boundaries/Problem'
import { Problem as SavedInstructions } from '../problems/2026-10-02-saved-instructions/Problem'

export const problems = [
  { id: '2026-09-30-async-search', title: '늦게 도착한 검색 결과', Component: AsyncSearch },
  { id: '2026-10-01-order-boundaries', title: '배송과 픽업, 어디까지 함께 둘까?', Component: OrderBoundaries },
  { id: '2026-10-02-saved-instructions', title: '작성 중인 안내와 저장된 안내', Component: SavedInstructions },
]
