import type { Listing } from '../types/listing'

// 화면에 이미 도착한 최초 목록. 최초 렌더에서는 요청하지 않는다.
export const initialListings: Listing[] = [
  { id: 'chair', title: '접이식 원목 의자', category: 'furniture', price: 15000 },
  { id: 'lamp', title: '작은 스탠드 조명', category: 'furniture', price: 8000 },
  { id: 'mug', title: '머그컵 두 개', category: 'daily', price: 5000 },
]
