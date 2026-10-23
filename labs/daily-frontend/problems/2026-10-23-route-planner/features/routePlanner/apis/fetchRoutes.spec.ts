import { http, HttpResponse } from 'msw/http'
import { describe, expect, it } from 'vitest'
import { createApiClient } from '../../../../../src/api/client'
import { server } from '../../../../../src/mocks/server'
import { fetchRoutes } from './fetchRoutes'

describe('경로 조회 HTTP 계약', () => {
  it('도착지를 GET query로 보내고 서버 목록을 반환한다', async () => {
    let destination: string | null = null
    let session: string | null = null
    const routes = [{ id: 'sample', title: '계약 확인 경로', minutes: 12, transfers: 0 }]
    server.use(
      http.get('*/api/daily/2026-10-23/routes', ({ request }) => {
        destination = new URL(request.url).searchParams.get('destination')
        session = request.headers.get('x-lab-session')
        return HttpResponse.json(routes)
      }),
    )
    await expect(fetchRoutes(createApiClient(), 'museum')).resolves.toEqual(routes)
    expect(destination).toBe('museum')
    expect(session).toBeTruthy()
  })

  it('공원은 세션 첫 요청에 실패하고 재시도하면 두 경로를 받는다', async () => {
    const request = createApiClient()
    await expect(fetchRoutes(request, 'park')).rejects.toThrow('지금은 경로를 조회할 수 없어요.')
    await expect(fetchRoutes(request, 'park')).resolves.toEqual([
      { id: 'direct', title: '강변 버스', minutes: 32, transfers: 0 },
      { id: 'transfer', title: '공원 환승선', minutes: 25, transfers: 1 },
    ])
  })

  it('미술관은 첫 요청부터 성공하고 공원의 실패 횟수를 소비하지 않는다', async () => {
    const request = createApiClient()
    await expect(fetchRoutes(request, 'museum')).resolves.toEqual([
      { id: 'direct', title: '미술관 순환선', minutes: 28, transfers: 0 },
      { id: 'transfer', title: '미술관 급행선', minutes: 19, transfers: 1 },
    ])
    await expect(fetchRoutes(request, 'park')).rejects.toThrow('지금은 경로를 조회할 수 없어요.')
  })

  it('부두는 비어 있는 성공 목록으로 응답한다', async () => {
    await expect(fetchRoutes(createApiClient(), 'pier')).resolves.toEqual([])
  })

  it('화면 재진입을 위한 새 API 세션은 첫 공원 실패부터 다시 시작한다', async () => {
    const first = createApiClient()
    await expect(fetchRoutes(first, 'park')).rejects.toThrow()
    await expect(fetchRoutes(first, 'park')).resolves.toHaveLength(2)
    await expect(fetchRoutes(createApiClient(), 'park')).rejects.toThrow('지금은 경로를 조회할 수 없어요.')
  })
})
