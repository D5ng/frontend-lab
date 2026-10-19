export type Reservation = { productIds: string[]; totalPrice: number }
export type ReserveProducts = (reservation: Reservation) => Promise<void>
