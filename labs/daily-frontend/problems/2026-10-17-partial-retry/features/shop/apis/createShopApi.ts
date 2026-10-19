import { createApiClient } from '../../../../../src/api/client'
import type { ShopProfile, Review, ShopApi } from '../types/shop'

export function createShopApi(): ShopApi {
  const request = createApiClient()
  return {
    loadProfile: () => request<ShopProfile>('/api/daily/2026-10-17/shop/profile'),
    loadReviews: () => request<Review[]>('/api/daily/2026-10-17/shop/reviews'),
  }
}
