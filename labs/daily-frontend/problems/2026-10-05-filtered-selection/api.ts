export const products = [
  { id: 'desk', title: '접이식 책상', price: 12000 },
  { id: 'books', title: '소설책 세 권', price: 5000 },
  { id: 'plant', title: '작은 화분', price: 0 },
] as const

export type Reservation = { productIds: string[]; totalPrice: number }
export type ReserveProducts = (reservation: Reservation) => Promise<void>

export function createDemoReservation(): ReserveProducts {
  let attempts = 0
  return async () => {
    attempts += 1
    const shouldFail = attempts === 1
    await new Promise<void>((resolve) => setTimeout(resolve, 800))
    if (shouldFail) throw new Error('일시적인 연결 실패')
  }
}
