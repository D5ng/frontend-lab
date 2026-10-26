import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../../src/mocks/scenario'
import { members } from './data'
import type { SplitRequest } from './types'
const path = '*/api/daily/2026-10-08-pickup-slots'
export const splitHandlers = [
  http.get(path + '/members', async () => {
    await delay(350)
    return HttpResponse.json(members)
  }),
  http.post(path + '/splits', async ({ request }) => {
    const input = (await request.json()) as SplitRequest
    if (
      !input.title?.trim() ||
      !Number.isSafeInteger(input.totalAmount) ||
      input.totalAmount < 1 ||
      !Array.isArray(input.shares) ||
      !input.shares.length ||
      new Set(input.shares.map((share) => share.memberId)).size !== input.shares.length ||
      input.shares.some(
        (share) => !members.some((member) => member.id === share.memberId) || !Number.isSafeInteger(share.amount) || share.amount < 0,
      ) ||
      input.shares.reduce((sum, share) => sum + share.amount, 0) !== input.totalAmount ||
      (input.method !== 'equal' && input.method !== 'weighted')
    )
      return HttpResponse.json({ message: '정산안을 확인해 주세요.' }, { status: 400 })
    const attempt = nextAttempt(request)
    await delay(700)
    if (attempt === 1) return HttpResponse.json({ message: '정산안을 저장하지 못했어요. 다시 시도해 주세요.' }, { status: 503 })
    return HttpResponse.json({ id: 'split-' + attempt }, { status: 201 })
  }),
]
