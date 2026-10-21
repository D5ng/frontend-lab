import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import { nextAttempt } from '../../src/mocks/scenario'
import type { Course } from './features/coursePlan/types/course'

const courses: Course[] = [
  { id: 'photo', title: '사진 구도 익히기', minutes: 60 },
  { id: 'voice', title: '발표 목소리 연습', minutes: 30 },
  { id: 'sketch', title: '색으로 정리하는 메모', minutes: 15 },
  { id: 'story', title: '짧은 글 구조 잡기', minutes: 30 },
]

export const handlers = [
  http.get('/api/daily/2026-10-21/courses', async ({ request }) => {
    const attempt = nextAttempt(request)
    await delay(800)
    if (attempt === 1) return HttpResponse.json({ message: '연습용 첫 조회 실패' }, { status: 503 })
    if (attempt === 2) return HttpResponse.json(courses)
    return HttpResponse.json(
      courses
        .filter((course) => course.id !== 'story')
        .map((course) => (course.id === 'voice' ? { ...course, title: '발표 호흡 다듬기', minutes: 25 } : course)),
    )
  }),
]
