import { http, HttpResponse } from 'msw/http'
import { describe, expect, it } from 'vitest'
import { createApiClient } from '../../../../../src/api/client'
import { server } from '../../../../../src/mocks/server'
import { requestExport } from './requestExport'

describe('내보내기 HTTP 계약', () => {
  it.each([
    { format: 'csv' as const, name: '표 기록', delimiter: 'tab' as const },
    { format: 'pdf' as const, name: '문서 기록', detail: 'full' as const },
  ])('$format 입력을 POST JSON으로 그대로 보내고 응답을 반환한다', async (input) => {
    let received: unknown
    let contentType: string | null = null
    server.use(
      http.post('*/api/daily/2026-10-22/exports', async ({ request }) => {
        received = await request.json()
        contentType = request.headers.get('content-type')
        return HttpResponse.json({ id: 'server-id', fileName: '서버 이름.csv' })
      }),
    )
    await expect(requestExport(createApiClient(), input)).resolves.toEqual({ id: 'server-id', fileName: '서버 이름.csv' })
    expect(received).toEqual(input)
    expect(contentType).toBe('application/json')
  })
  it.each([
    { format: 'csv' as const, name: '표 기록', delimiter: 'tab' as const },
    { format: 'pdf' as const, name: '문서 기록', detail: 'full' as const },
  ])('$format의 첫 실패를 오류로 전환하고 다음 요청의 확장자를 반환한다', async (input) => {
    const request = createApiClient()
    await expect(requestExport(request, input)).rejects.toThrow('지금은 내보내기를 접수할 수 없어요.')
    await expect(requestExport(request, input)).resolves.toEqual({ id: 'export-2', fileName: `${input.name}.${input.format}` })
  })
})
