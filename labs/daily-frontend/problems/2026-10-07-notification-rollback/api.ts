import { createApiClient } from '../../src/api/client'

export const products = [
  { id: 'desk', title: '원목 책상', detail: '가격이 내려가면 알려드려요', enabled: false },
  { id: 'books', title: '소설 전집', detail: '가격이 내려가면 알려드려요', enabled: true },
  { id: 'plant', title: '작은 화분', detail: '가격이 내려가면 알려드려요', enabled: false },
] as const

export type UpdateNotification = (request: { productId: string; enabled: boolean }) => Promise<void>

// HTTP 응답 모킹은 handlers.ts에 두고 기존 함수 주입 계약을 유지한다.
export function createNotificationMock(): UpdateNotification {
  const request = createApiClient()
  return (notification) =>
    request('/api/daily/2026-10-07-notification-rollback/notifications', { method: 'PATCH', body: JSON.stringify(notification) })
}
