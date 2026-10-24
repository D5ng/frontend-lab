import { http, HttpResponse } from 'msw/http'
import { describe, expect, it } from 'vitest'
import { createApiClient } from '../../../../../src/api/client'
import { server } from '../../../../../src/mocks/server'
import { savePlaylist } from './savePlaylist'

describe('재생 순서 HTTP 계약', () => {
  it('PUT으로 순서를 JSON 그대로 보내고 서버 확정 순서를 반환한다', async () => {
    let received: unknown
    let contentType: string | null = null
    server.use(
      http.put('*/api/daily/2026-10-24/playlist', async ({ request }) => {
        received = await request.json()
        contentType = request.headers.get('content-type')
        return HttpResponse.json({ orderedIds: ['talk', 'music', 'walk'] })
      }),
    )
    await expect(savePlaylist(createApiClient(), { orderedIds: ['music', 'walk', 'talk'] })).resolves.toEqual({
      orderedIds: ['talk', 'music', 'walk'],
    })
    expect(received).toEqual({ orderedIds: ['music', 'walk', 'talk'] })
    expect(contentType).toBe('application/json')
  })

  it('첫 저장은 실패하고 다음 저장은 입력 순서 그대로 성공한다', async () => {
    const request = createApiClient()
    const input = { orderedIds: ['music', 'walk', 'talk'] }
    await expect(savePlaylist(request, input)).rejects.toThrow('지금은 순서를 저장할 수 없어요.')
    await expect(savePlaylist(request, input)).resolves.toEqual(input)
  })

  it('중복되거나 빠진 항목은 400 오류로 전환한다', async () => {
    await expect(savePlaylist(createApiClient(), { orderedIds: ['walk', 'walk', 'talk'] })).rejects.toThrow(
      '세 에피소드의 순서를 확인해 주세요.',
    )
  })
})
