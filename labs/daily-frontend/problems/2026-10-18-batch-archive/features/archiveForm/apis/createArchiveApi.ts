import { createApiClient } from '../../../../../src/api/client'
import type { ArchiveProducts } from '../types/archive'

export function createArchiveApi(): ArchiveProducts {
  const request = createApiClient()
  return (productIds) => request('/api/daily/2026-10-18/archive', { method: 'POST', body: JSON.stringify({ productIds }) })
}
