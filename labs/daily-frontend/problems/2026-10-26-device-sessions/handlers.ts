import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'

export const handlers = [
  http.delete('*/api/daily/2026-10-26/sessions/:id', async ({ request, params }) => {
    const id = params.id
    if (id === 'current') return HttpResponse.json({ message: '현재 기기는 이 화면에서 해제할 수 없어요.' }, { status: 403 })
    if (id !== 'phone' && id !== 'tablet') return HttpResponse.json({ message: '해제할 기기를 찾지 못했어요.' }, { status: 404 })
    const attempt = nextAttempt(request)
    await delay(id === 'phone' ? 1100 : 400)
    if (attempt === 1) return HttpResponse.json({ message: '연결 해제를 완료하지 못했어요. 다시 시도해 주세요.' }, { status: 503 })
    return new HttpResponse(null, { status: 204 })
  }),
]
