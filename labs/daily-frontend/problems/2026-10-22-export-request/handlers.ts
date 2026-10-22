import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
import type { ExportInput } from './features/exportRequest/types/exportRequest'

export const handlers = [
  http.post('*/api/daily/2026-10-22/exports', async ({ request }) => {
    const attempt = nextAttempt(request)
    const input = (await request.json()) as ExportInput
    await delay(900)
    if (attempt === 1) {
      return HttpResponse.json({ message: '지금은 내보내기를 접수할 수 없어요. 다시 시도해 주세요.' }, { status: 503 })
    }
    return HttpResponse.json({ id: `export-${attempt}`, fileName: `${input.name}.${input.format}` })
  }),
]
