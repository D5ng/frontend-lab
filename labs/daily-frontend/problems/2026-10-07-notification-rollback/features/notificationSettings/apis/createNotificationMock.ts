import { createApiClient } from '../../../../../src/api/client'
import type { UpdateNotification } from '../types/notification'

// HTTP 응답 모킹은 handlers.ts에 두고 기존 함수 주입 계약을 유지한다.
export function createNotificationMock(): UpdateNotification {
  const request = createApiClient()
  return (notification) =>
    request('/api/daily/2026-10-07-notification-rollback/notifications', { method: 'PATCH', body: JSON.stringify(notification) })
}
