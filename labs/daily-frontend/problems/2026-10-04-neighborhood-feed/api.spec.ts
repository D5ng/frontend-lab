import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw/http'
import { server } from '../../src/mocks/server'
import { createDemoLoader } from './api'

describe('MSW HTTP 계약', () => {
  it('요청 URL·메서드·본문을 전달하고 HTTP 응답을 API 반환값으로 변환한다', async () => {
    let received: { method: string; path: string; body: unknown } | undefined
    server.use(
      http.get('*/api/daily/2026-10-04-neighborhood-feed/posts', async ({ request }) => {
        const url = new URL(request.url)
        received = { method: request.method, path: url.pathname + url.search, body: undefined }
        return HttpResponse.json([{ id: 's1', title: '게시글', price: 7000, neighborhood: 'seongsu' }])
      }),
    )
    const api = createDemoLoader()
    await expect(api('seongsu')).resolves.toEqual([{ id: 's1', title: '게시글', price: 7000, neighborhood: 'seongsu' }])
    expect(received).toEqual({ method: 'GET', path: '/api/daily/2026-10-04-neighborhood-feed/posts?neighborhood=seongsu', body: undefined })
  })

  it('새 API 세션은 첫 실패를 다시 경험하고 이전 세션의 재시도는 성공한다', async () => {
    const api = createDemoLoader()
    const first = expect(api('yeonnam')).rejects.toThrow('temporary failure')
    const other = createDemoLoader()
    const separate = expect(other('yeonnam')).rejects.toThrow('temporary failure')
    await Promise.all([first, separate])
    await expect(api('yeonnam')).resolves.toBeDefined()
  })
})
