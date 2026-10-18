import { createApiClient } from '../../src/api/client'

export const initialProducts = [
  { id: 'chair', title: '원목 의자', detail: '성수동 · 20,000원' },
  { id: 'lamp', title: '책상 조명', detail: '성수동 · 15,000원' },
  { id: 'shelf', title: '작은 책장', detail: '성수동 · 나눔' },
]

export interface ArchiveResult {
  succeededIds: string[]
  failedIds: string[]
}
export type ArchiveProducts = (productIds: string[]) => Promise<ArchiveResult>

export function createArchiveApi(): ArchiveProducts {
  const request = createApiClient()
  return (productIds) => request('/api/daily/2026-10-18/archive', { method: 'POST', body: JSON.stringify({ productIds }) })
}
