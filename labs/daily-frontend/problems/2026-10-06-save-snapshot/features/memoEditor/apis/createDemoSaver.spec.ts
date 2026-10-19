import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw/http'
import { server } from '../../../../../src/mocks/server'
import { createDemoSaver } from './createDemoSaver'

describe('MSW HTTP 계약', () => {
  it('요청 URL·메서드·본문을 전달하고 HTTP 응답을 API 반환값으로 변환한다', async () => {
    let received: { method: string; path: string; body: unknown } | undefined
    server.use(
      http.put('*/api/daily/2026-10-06-save-snapshot/memo', async ({ request }) => {
        const url = new URL(request.url)
        received = { method: request.method, path: url.pathname + url.search, body: await request.json() }
        return HttpResponse.json({ memo: '새 메모' })
      }),
    )
    const api = createDemoSaver()
    await expect(api({ memo: '새 메모' })).resolves.toEqual({ memo: '새 메모' })
    expect(received).toEqual({ method: 'PUT', path: '/api/daily/2026-10-06-save-snapshot/memo', body: { memo: '새 메모' } })
  })

  it('새 API 세션은 첫 실패를 다시 경험하고 이전 세션의 재시도는 성공한다', async () => {
    const api = createDemoSaver()
    const first = expect(api({ memo: '첫 메모' })).rejects.toThrow('일시적인 연결 실패')
    const other = createDemoSaver()
    const separate = expect(other({ memo: '첫 메모' })).rejects.toThrow('일시적인 연결 실패')
    await Promise.all([first, separate])
    await expect(api({ memo: '첫 메모' })).resolves.toBeDefined()
  })
})
