import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw/http'
import { server } from '../../../../../src/mocks/server'
import { createNotificationMock } from './createNotificationMock'

describe('MSW HTTP 계약', () => {
  it('요청 URL·메서드·본문을 전달하고 HTTP 응답을 API 반환값으로 변환한다', async () => {
    let received: { method: string; path: string; body: unknown } | undefined
    server.use(
      http.patch('*/api/daily/2026-10-07-notification-rollback/notifications', async ({ request }) => {
        const url = new URL(request.url)
        received = { method: request.method, path: url.pathname + url.search, body: await request.json() }
        return new HttpResponse(null, { status: 204 })
      }),
    )
    const api = createNotificationMock()
    await expect(api({ productId: 'books', enabled: false })).resolves.toEqual(undefined)
    expect(received).toEqual({
      method: 'PATCH',
      path: '/api/daily/2026-10-07-notification-rollback/notifications',
      body: { productId: 'books', enabled: false },
    })
  })

  it('새 API 세션은 첫 실패를 다시 경험하고 이전 세션의 재시도는 성공한다', async () => {
    const api = createNotificationMock()
    const first = expect(api({ productId: 'desk', enabled: true })).rejects.toThrow('설정 변경 실패')
    const other = createNotificationMock()
    const separate = expect(other({ productId: 'desk', enabled: true })).rejects.toThrow('설정 변경 실패')
    await Promise.all([first, separate])
    await expect(api({ productId: 'desk', enabled: true })).resolves.toBeUndefined()
  })
})
