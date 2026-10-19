import { createApiClient } from '../../src/api/client'

export interface Product {
  id: string
  title: string
  detail: string
}
export const initialProducts: Product[] = [
  { id: 'chair', title: '원목 의자', detail: '성수동 · 20,000원' },
  { id: 'lamp', title: '책상 조명', detail: '성수동 · 15,000원' },
  { id: 'shelf', title: '작은 책장', detail: '성수동 · 나눔' },
]

export interface RemovalApi {
  remove: (id: string) => Promise<void>
  restore: (id: string) => Promise<void>
}

export function createRemovalApi(): RemovalApi {
  const request = createApiClient()
  return {
    remove: (id) => request(`/api/daily/2026-10-19/items/${id}`, { method: 'DELETE' }),
    restore: (id) => request(`/api/daily/2026-10-19/items/${id}/restore`, { method: 'POST' }),
  }
}
