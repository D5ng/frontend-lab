export type Product = { id: string; title: string; price: number }
export type Reservation = { productIds: string[]; totalPrice: number }
export type ReserveProducts = (reservation: Reservation) => Promise<void>

export type ProductFilter = 'all' | 'free'

export type ReservationResult = 'success' | 'error'
