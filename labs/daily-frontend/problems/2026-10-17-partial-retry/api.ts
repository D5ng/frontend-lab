import { createApiClient } from '../../src/api/client'

export type ShopProfile = { name: string; neighborhood: string; description: string }
export type Review = { id: string; author: string; body: string }
export interface ShopApi {
  loadProfile: () => Promise<ShopProfile>
  loadReviews: () => Promise<Review[]>
}

export function createShopApi(): ShopApi {
  const request = createApiClient()
  return {
    loadProfile: () => request<ShopProfile>('/api/daily/2026-10-17/shop/profile'),
    loadReviews: () => request<Review[]>('/api/daily/2026-10-17/shop/reviews'),
  }
}
