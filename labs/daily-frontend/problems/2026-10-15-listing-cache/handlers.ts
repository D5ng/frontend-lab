import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
import type { ListingDetail } from './api'

const details: Record<string, ListingDetail | null> = {
  chair: { id: 'chair', price: 15000, description: '접어서 보관할 수 있어요. 성수역에서 직거래해요.', neighborhood: '성수동' },
  lamp: { id: 'lamp', price: 8000, description: '밝기 조절이 되는 조명이에요. 전구도 함께 드려요.', neighborhood: '연남동' },
  mug: null,
}

export const handlers = [
  http.get('*/api/daily/2026-10-15/listings/:id', async ({ params, request }) => {
    const id = String(params.id)
    if (!(id in details)) return HttpResponse.json({ message: '없는 물건이에요.' }, { status: 404 })
    const attempt = nextAttempt(request)
    await delay(id === 'chair' ? 1800 : id === 'lamp' ? 450 : 650)
    if (id === 'lamp' && attempt === 1) return HttpResponse.json({ message: '일시적으로 상세를 불러오지 못했어요.' }, { status: 503 })
    return HttpResponse.json(details[id])
  }),
]
