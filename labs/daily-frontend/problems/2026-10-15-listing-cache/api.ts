import { createApiClient } from '../../src/api/client'

export const listings = [
  { id: 'chair', title: '접이식 원목 의자' },
  { id: 'lamp', title: '작은 스탠드 조명' },
  { id: 'mug', title: '머그컵 두 개' },
] as const
export type ListingId = (typeof listings)[number]['id']
export type ListingDetail = { id: ListingId; price: number; description: string; neighborhood: string }
// null은 정상 응답(거래 종료)이며 실패나 미조회와 다르다.
export type LoadDetail = (id: ListingId) => Promise<ListingDetail | null>

export function createDetailApi(): LoadDetail {
  const request = createApiClient()
  return (id) => request<ListingDetail | null>(`/api/daily/2026-10-15/listings/${id}`)
}
