import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
import type { Quote } from './features/reservationReview/types/reservation'

const issuedQuotes = new Map<string, Quote>()
export const handlers = [
  http.post('*/api/daily/2026-10-16/quotes', async ({ request }) => {
    const { count } = (await request.json()) as { count: number }
    if (![1, 2, 3].includes(count)) return HttpResponse.json({ message: '인원을 확인해 주세요.' }, { status: 400 })
    const attempt = nextAttempt(request)
    await delay(900)
    if (attempt === 1) return HttpResponse.json({ message: '금액 확인에 실패했어요.' }, { status: 503 })
    const quote: Quote = { quoteId: crypto.randomUUID(), count, totalPrice: count === 1 ? 15000 : count === 2 ? 28000 : 42000 }
    issuedQuotes.set(`${request.headers.get('x-lab-session')}:${quote.quoteId}`, quote)
    return HttpResponse.json(quote)
  }),
  http.post('*/api/daily/2026-10-16/reservations', async ({ request }) => {
    const { quoteId } = (await request.json()) as { quoteId: string }
    const quote = issuedQuotes.get(`${request.headers.get('x-lab-session')}:${quoteId}`)
    if (!quote) return HttpResponse.json({ message: '확인한 금액이 없어요.' }, { status: 400 })
    const attempt = nextAttempt(request)
    await delay(1400)
    if (attempt === 1) return HttpResponse.json({ message: '예약 요청에 실패했어요.' }, { status: 503 })
    return HttpResponse.json({ reservationId: `reservation-${quoteId}`, count: quote.count, totalPrice: quote.totalPrice })
  }),
]
