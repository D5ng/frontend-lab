import { delay, http, HttpResponse } from 'msw'

// 모의 서버다. 풀이 대상이 아니다.
const BASE = '/api/drills/2026-11-02'

// 대기 신청 주소가 새로 생겼다. 문제 2의 모의 수업은 자리가 남아 있어서, 화면에서 보려면
// problem-2/handlers.ts의 bookedCount를 8로, waitlistCount를 3으로 바꾼다.
export const handlers = [
  http.post(`${BASE}/classes/:classId/waitlist`, async ({ params, request }) => {
    const { passId } = (await request.json()) as { passId: string }
    await delay()
    const response = await fetch(new URL(`${BASE}/classes/${String(params.classId)}`, request.url))
    const { gymClass, passes } = (await response.json()) as { gymClass: { waitlistCount: number }; passes: unknown[] }
    const position = gymClass.waitlistCount + 1

    // 대기는 수강권을 바로 쓰지 않는다. 자리가 나서 예약될 때 1회가 빠진다.
    return HttpResponse.json(
      { gymClass: { ...gymClass, waitlistCount: position, myWaitlist: { passId, position } }, passes },
      { status: 201 },
    )
  }),
]
