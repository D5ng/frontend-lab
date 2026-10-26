import type { Product } from '../types/notification'

export const products: Product[] = [
  { id: 'desk', title: '접이식 원목 책상', neighborhood: '연희동', price: 42000, available: true },
  { id: 'lamp', title: '작은 유리 조명', neighborhood: '성산동', price: 18000, available: true },
  { id: 'books', title: '주말에 읽는 소설 세트', neighborhood: '연남동', price: 12000, available: true },
  { id: 'chair', title: '라탄 의자', neighborhood: '망원동', price: 25000, available: false },
]
