export const products = [
  { id: 'desk', title: '원목 책상', detail: '가격이 내려가면 알려드려요', enabled: false },
  { id: 'books', title: '소설 전집', detail: '가격이 내려가면 알려드려요', enabled: true },
  { id: 'plant', title: '작은 화분', detail: '가격이 내려가면 알려드려요', enabled: false },
] as const

export type UpdateNotification = (request: { productId: string; enabled: boolean }) => Promise<void>

export function createNotificationMock(): UpdateNotification {
  let deskAttempts = 0
  return ({ productId }) => {
    if (productId === 'desk') deskAttempts += 1
    const shouldFail = productId === 'desk' && deskAttempts === 1
    const delay = productId === 'desk' ? 1800 : productId === 'books' ? 450 : 700
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) reject(new Error('설정 변경 실패'))
        else resolve()
      }, delay)
    })
  }
}
