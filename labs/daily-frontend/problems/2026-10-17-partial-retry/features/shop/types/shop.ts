export type ShopProfile = { name: string; neighborhood: string; description: string }

export type Review = { id: string; author: string; body: string }

export interface ShopApi {
  loadProfile: () => Promise<ShopProfile>
  loadReviews: () => Promise<Review[]>
}
