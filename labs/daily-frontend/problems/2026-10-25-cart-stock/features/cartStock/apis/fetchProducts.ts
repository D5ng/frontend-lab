import type { createApiClient } from '../../../../../src/api/client'
import type { Product } from '../types/product'

export function fetchProducts(request: ReturnType<typeof createApiClient>) {
  return request<Product[]>('/api/daily/2026-10-25/products')
}
