import type { Product } from '../types/reservation'

export const products: Product[] = [
  { id: 'desk', title: '접이식 책상', price: 12000 },
  { id: 'books', title: '소설책 세 권', price: 5000 },
  { id: 'plant', title: '작은 화분', price: 0 },
] as const
