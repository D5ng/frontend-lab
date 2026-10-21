import { describe, expect, it } from 'vitest'
import { createApiClient } from '../../../../../src/api/client'
import { fetchCourses } from './fetchCourses'

describe('강좌 HTTP 모의 환경', () => {
  it('첫 오류 뒤 같은 세션 재시도는 원본 목록을 받는다', async () => {
    const request = createApiClient()
    await expect(fetchCourses(request)).rejects.toThrow('연습용 첫 조회 실패')
    const courses = await fetchCourses(request)
    expect(courses.map((course) => course.id)).toEqual(['photo', 'voice', 'sketch', 'story'])
    expect(courses.find((course) => course.id === 'voice')?.minutes).toBe(30)
  })
  it('세 번째 조회는 폐강과 변경된 강좌 정보를 돌려준다', async () => {
    const request = createApiClient()
    await expect(fetchCourses(request)).rejects.toThrow()
    await fetchCourses(request)
    const courses = await fetchCourses(request)
    expect(courses.some((course) => course.id === 'story')).toBe(false)
    expect(courses.find((course) => course.id === 'voice')).toEqual({ id: 'voice', title: '발표 호흡 다듬기', minutes: 25 })
  })
  it('세션이 바뀌면 첫 실패부터 다시 시작한다', async () => {
    await expect(fetchCourses(createApiClient())).rejects.toThrow()
    await expect(fetchCourses(createApiClient())).rejects.toThrow()
  })
})
