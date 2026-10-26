import { http, HttpResponse } from 'msw/http'
import { describe, expect, it } from 'vitest'
import { createApiClient } from '../../../../../src/api/client'
import { server } from '../../../../../src/mocks/server'
import { endSession } from './endSession'

describe('가상 연결 해제 HTTP 계약', () => {
  it('기기 ID로 DELETE하고 본문 없이 보내며 204를 undefined로 반환한다', async () => {
    let body: string | undefined
    let id: string | readonly string[] | undefined
    let session: string | null = null
    server.use(
      http.delete('*/api/daily/2026-10-26/sessions/:id', async ({ request, params }) => {
        body = await request.text()
        id = params.id
        session = request.headers.get('x-lab-session')
        return new HttpResponse(null, { status: 204 })
      }),
    )
    await expect(endSession(createApiClient(), 'phone')).resolves.toBeUndefined()
    expect(body).toBe('')
    expect(id).toBe('phone')
    expect(session).toBeTruthy()
  })

  it('각 기기 첫 요청은 독립적으로 실패하고 재시도는 성공한다', async () => {
    const request = createApiClient()
    await expect(endSession(request, 'phone')).rejects.toThrow('연결 해제를 완료하지 못했어요.')
    await expect(endSession(request, 'phone')).resolves.toBeUndefined()
    await expect(endSession(request, 'tablet')).rejects.toThrow('연결 해제를 완료하지 못했어요.')
    await expect(endSession(request, 'tablet')).resolves.toBeUndefined()
  })

  it('현재 기기 해제 요청은 서버에서도 거절한다', async () => {
    await expect(endSession(createApiClient(), 'current')).rejects.toThrow('현재 기기는 이 화면에서 해제할 수 없어요.')
  })
})
