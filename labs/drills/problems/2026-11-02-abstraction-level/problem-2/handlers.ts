import { delay, http, HttpResponse } from 'msw'

// 모의 서버다. 풀이 대상이 아니다.
const BASE = '/api/drills/2026-11-02'

const gymClass = {
  id: 'mat-1104-1900',
  name: '매트 필라테스 중급',
  studioName: '망원 바른몸 필라테스',
  room: '2층 B룸',
  startsAt: '2026-11-04T19:00:00+09:00',
  durationMinutes: 50,
  instructor: { name: '정다은', intro: '경력 6년 · 소도구 필라테스', profileImageUrl: null },
  capacity: 8,
  bookedCount: 6,
  waitlistCount: 0,
  cancelDeadlineHours: 4,
  myBooking: null,
}

const passes = [
  { id: 'group-10', name: '그룹 10회권', remainingCount: 7, expiresAt: '2026-12-31T23:59:59+09:00' },
  { id: 'group-30', name: '그룹 30회권', remainingCount: 18, expiresAt: '2027-03-31T23:59:59+09:00' },
  { id: 'group-4', name: '그룹 4회권', remainingCount: 0, expiresAt: '2026-11-30T23:59:59+09:00' },
  { id: 'trial-1', name: '체험 1회권', remainingCount: 1, expiresAt: '2026-11-03T23:59:59+09:00' },
]

export const handlers = [
  http.get(`${BASE}/classes/${gymClass.id}`, async () => {
    await delay()
    return HttpResponse.json({ gymClass, passes })
  }),

  // 화면에서 여러 번 눌러 볼 수 있도록 서버 데이터는 바꾸지 않고, 예약한 결과만 돌려준다.
  http.post(`${BASE}/classes/${gymClass.id}/bookings`, async ({ request }) => {
    const { passId } = (await request.json()) as { passId: string }
    await delay()
    return HttpResponse.json(
      {
        gymClass: { ...gymClass, bookedCount: gymClass.bookedCount + 1, myBooking: { passId } },
        passes: passes.map((pass) => (pass.id === passId ? { ...pass, remainingCount: pass.remainingCount - 1 } : pass)),
      },
      { status: 201 },
    )
  }),
]
