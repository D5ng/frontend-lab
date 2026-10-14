import { createApiClient } from '../../src/api/client'

export type Category = 'furniture' | 'daily' | 'books'
export type Listing = { id: string; title: string; category: Category; price: number }
export type SearchListings = (categories: Category[]) => Promise<Listing[]>

export const categories: { value: Category; label: string }[] = [
  { value: 'furniture', label: '가구' },
  { value: 'daily', label: '생활용품' },
  { value: 'books', label: '도서' },
]

// 화면에 이미 도착한 최초 목록. 최초 렌더에서는 요청하지 않는다.
export const initialListings: Listing[] = [
  { id: 'chair', title: '접이식 원목 의자', category: 'furniture', price: 15000 },
  { id: 'lamp', title: '작은 스탠드 조명', category: 'furniture', price: 8000 },
  { id: 'mug', title: '머그컵 두 개', category: 'daily', price: 5000 },
]

export function createListingsApi(): SearchListings {
  const request = createApiClient()
  return (selected) =>
    request<Listing[]>('/api/daily/2026-10-14/listings', {
      method: 'POST',
      body: JSON.stringify({ categories: selected }),
    })
}
