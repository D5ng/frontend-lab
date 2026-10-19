export type Quote = { quoteId: string; count: number; totalPrice: number }

export type Receipt = { reservationId: string; count: number; totalPrice: number }

export interface ReservationApi {
  getQuote: (count: number) => Promise<Quote>
  confirm: (quoteId: string) => Promise<Receipt>
}
