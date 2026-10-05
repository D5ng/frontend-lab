import { Problem as AsyncSearch } from '../problems/2026-09-30-async-search/Problem'
import { Problem as OrderBoundaries } from '../problems/2026-10-01-order-boundaries/Problem'
import { Problem as FilteredSelection } from '../problems/2026-10-05-filtered-selection/Problem'

export const problems = [
  { id: '2026-10-05-filtered-selection', title: '숨겨진 상품도 선택한 상품일까?', Component: FilteredSelection },
  { id: '2026-09-30-async-search', title: '늦게 도착한 검색 결과', Component: AsyncSearch },
  { id: '2026-10-01-order-boundaries', title: '배송과 픽업, 어디까지 함께 둘까?', Component: OrderBoundaries },
]
