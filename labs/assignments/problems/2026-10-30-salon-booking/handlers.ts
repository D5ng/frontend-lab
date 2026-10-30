import { delay, http, HttpResponse } from 'msw'

// 모의 서버다. 풀이 대상이 아니다.
const BASE = '/api/assignments/salon-booking'

const salon = {
  id: 'salon-1',
  name: '골목 헤어',
  now: '2026-11-07T13:10:00+09:00',
  openTime: '10:00',
  closeTime: '20:00',
  designers: [
    { id: 'd1', name: '하늘 원장', dayOffs: ['MON'], serviceIds: ['cut', 'color-basic', 'color-bleach', 'perm-digital'] },
    { id: 'd2', name: '도윤 실장', dayOffs: ['TUE', 'WED'], serviceIds: ['cut', 'perm-setting', 'clinic'] },
  ],
  services: [
    { id: 'cut', name: '커트', category: 'cut', minutes: 30, price: 20000 },
    { id: 'color-basic', name: '기본 염색', category: 'color', minutes: 90, price: 70000 },
    { id: 'color-bleach', name: '탈색', category: 'color', minutes: 120, price: 110000 },
    { id: 'perm-digital', name: '디지털 펌', category: 'perm', minutes: 150, price: 130000 },
    { id: 'perm-setting', name: '셋팅 펌', category: 'perm', minutes: 120, price: 100000 },
    { id: 'clinic', name: '두피 클리닉', category: 'care', minutes: 40, price: 35000 },
  ],
}

// 디자이너별, 날짜별로 이미 잡힌 예약
const bookings: Record<string, Record<string, { start: string; end: string }[]>> = {
  d1: {
    '2026-11-07': [
      { start: '13:30', end: '15:00' },
      { start: '17:00', end: '18:30' },
    ],
    '2026-11-08': [{ start: '10:00', end: '20:00' }],
    '2026-11-10': [{ start: '11:00', end: '12:30' }],
  },
  d2: {
    '2026-11-07': [{ start: '10:00', end: '12:00' }],
    '2026-11-12': [{ start: '15:00', end: '17:00' }],
  },
}

// 16:00에 시작하는 예약은 그새 다른 사람이 가져간 상황을 재현한다.
const TAKEN_START = '16:00'

let nextBookingId = 123

export const handlers = [
  http.get(`${BASE}/salons/salon-1`, async () => {
    await delay(500)
    return HttpResponse.json(salon)
  }),

  http.get(`${BASE}/salons/salon-1/bookings`, async ({ request }) => {
    await delay(500)
    const url = new URL(request.url)
    const designerId = url.searchParams.get('designerId') ?? ''
    const date = url.searchParams.get('date') ?? ''
    return HttpResponse.json(bookings[designerId]?.[date] ?? [])
  }),

  http.post(`${BASE}/salons/salon-1/bookings`, async ({ request }) => {
    await delay(500)
    const body = (await request.json()) as { start?: string }
    if (body.start === TAKEN_START) {
      return HttpResponse.json({ code: 'SLOT_TAKEN' }, { status: 409 })
    }
    return HttpResponse.json({ id: `b-${nextBookingId++}` }, { status: 201 })
  }),
]
