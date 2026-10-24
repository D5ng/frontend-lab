import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
import type { PlaylistInput } from './features/playlist/types/playlist'

export const handlers = [
  http.put('*/api/daily/2026-10-24/playlist', async ({ request }) => {
    const attempt = nextAttempt(request)
    const input = (await request.json()) as PlaylistInput
    await delay(850)
    if (
      input.orderedIds.length !== 3 ||
      new Set(input.orderedIds).size !== 3 ||
      !input.orderedIds.every((id) => ['walk', 'music', 'talk'].includes(id))
    ) {
      return HttpResponse.json({ message: '세 에피소드의 순서를 확인해 주세요.' }, { status: 400 })
    }
    if (attempt === 1) {
      return HttpResponse.json({ message: '지금은 순서를 저장할 수 없어요. 다시 시도해 주세요.' }, { status: 503 })
    }
    return HttpResponse.json({ orderedIds: input.orderedIds })
  }),
]
