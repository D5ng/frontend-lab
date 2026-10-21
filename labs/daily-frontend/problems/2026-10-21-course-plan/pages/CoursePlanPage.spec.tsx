import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Course } from '../features/coursePlan/types/course'
import { CoursePlanPage } from './CoursePlanPage'

afterEach(cleanup)
const courses: Course[] = [
  { id: 'photo', title: '사진 구도 익히기', minutes: 60 },
  { id: 'voice', title: '발표 목소리 연습', minutes: 30 },
  { id: 'sketch', title: '색으로 정리하는 메모', minutes: 15 },
  { id: 'story', title: '짧은 글 구조 잡기', minutes: 30 },
]
function deferred() {
  let resolve!: (data: Course[]) => void
  let reject!: (error: Error) => void
  const promise = new Promise<Course[]>((done, fail) => {
    resolve = done
    reject = fail
  })
  return { promise, resolve, reject }
}
const reload = () => screen.getByRole('button', { name: '강좌 다시 불러오기' })
const time = () => screen.getByRole('textbox', { name: '학습 시간 상한' })
const plan = () => screen.getByRole('region', { name: '학습 계획' })

describe('제공 골격', () => {
  it('페이지의 제목과 사용자 목적을 전달한다', () => {
    const load = vi.fn().mockResolvedValue([])
    render(<CoursePlanPage loadCourses={load} />)
    expect(screen.getByRole('heading', { name: '오늘의 학습 강좌' })).toBeInTheDocument()
  })
})

// AUTHORING: 페이지를 처음부터 구현한 뒤 skip을 제거합니다. 출제 시 미실행 8개입니다.
describe.skip('실습자 구현 행동', () => {
  it('진입 시 한 번 조회하고 진행 중 재조회와 입력을 잠근 뒤 짧은 순서로 표시한다', async () => {
    const user = userEvent.setup()
    const request = deferred()
    const load = vi.fn(() => request.promise)
    render(<CoursePlanPage loadCourses={load} />)
    expect(load).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status')).toHaveTextContent('강좌를 불러오고 있어요.')
    expect(time()).toBeDisabled()
    await user.dblClick(reload())
    expect(load).toHaveBeenCalledTimes(1)
    await act(async () => request.resolve(courses))
    expect(screen.getAllByRole('radio')).toHaveLength(4)
    expect(screen.getAllByRole('radio')[0]).toHaveAccessibleName(/색으로 정리하는 메모/)
    expect(screen.getAllByRole('radio')[3]).toHaveAccessibleName(/사진 구도 익히기/)
    expect(reload()).toBeEnabled()
  })
  it('첫 조회 실패는 오류와 재시도를 제공하고 빈 목록 성공으로 보이지 않는다', async () => {
    const user = userEvent.setup()
    const load = vi.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce(courses)
    render(<CoursePlanPage loadCourses={load} />)
    expect(await screen.findByRole('alert')).toHaveTextContent('강좌를 불러오지 못했어요. 다시 시도해 주세요.')
    expect(screen.queryByText('등록된 강좌가 없어요.')).not.toBeInTheDocument()
    await user.click(reload())
    expect(await screen.findByRole('radio', { name: /색으로 정리하는 메모/ })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(load).toHaveBeenCalledTimes(2)
  })
  it('상한 경계는 포함하고 보이지 않게 된 선택을 해제하며 다시 나타나도 자동 선택하지 않는다', async () => {
    const user = userEvent.setup()
    render(<CoursePlanPage loadCourses={vi.fn().mockResolvedValue(courses)} />)
    await user.click(await screen.findByRole('radio', { name: /발표 목소리 연습/ }))
    await user.click(time())
    await user.paste('30')
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(plan()).toHaveTextContent('발표 목소리 연습')
    await user.clear(time())
    await user.type(time(), '15')
    expect(screen.getAllByRole('radio')).toHaveLength(1)
    expect(plan()).toHaveTextContent('아직 강좌를 고르지 않았어요.')
    await user.clear(time())
    await user.click(time())
    await user.paste('30')
    expect(screen.getByRole('radio', { name: /발표 목소리 연습/ })).not.toBeChecked()
  })
  it('재조회 실패는 기존 목록·입력·선택을 보존한다', async () => {
    const user = userEvent.setup()
    const next = deferred()
    const load = vi.fn().mockResolvedValueOnce(courses).mockReturnValueOnce(next.promise)
    render(<CoursePlanPage loadCourses={load} />)
    await user.click(await screen.findByRole('radio', { name: /짧은 글 구조 잡기/ }))
    await user.click(time())
    await user.paste('30')
    await user.click(reload())
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled())
    await act(async () => next.reject(new Error('fail')))
    expect(time()).toHaveValue('30')
    expect(plan()).toHaveTextContent('짧은 글 구조 잡기')
    expect(screen.getByRole('radio', { name: /짧은 글 구조 잡기/ })).toBeChecked()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
  it('재조회 성공으로 사라진 강좌는 계획에서도 사라진다', async () => {
    const user = userEvent.setup()
    const load = vi
      .fn()
      .mockResolvedValueOnce(courses)
      .mockResolvedValueOnce(courses.filter((course) => course.id !== 'story'))
    render(<CoursePlanPage loadCourses={load} />)
    await user.click(await screen.findByRole('radio', { name: /짧은 글 구조 잡기/ }))
    await user.click(reload())
    expect(plan()).toHaveTextContent('아직 강좌를 고르지 않았어요.')
    expect(screen.queryByRole('radio', { name: /짧은 글 구조 잡기/ })).not.toBeInTheDocument()
  })
  it('같은 ID가 남으면 새 제목과 시간으로 계획을 갱신한다', async () => {
    const user = userEvent.setup()
    const changed = courses.map((course) => (course.id === 'voice' ? { ...course, title: '발표 호흡 다듬기', minutes: 25 } : course))
    const load = vi.fn().mockResolvedValueOnce(courses).mockResolvedValueOnce(changed)
    render(<CoursePlanPage loadCourses={load} />)
    await user.click(await screen.findByRole('radio', { name: /발표 목소리 연습/ }))
    await user.click(reload())
    expect(within(plan()).getByText(/발표 호흡 다듬기/)).toBeInTheDocument()
    expect(plan()).toHaveTextContent('25분')
    expect(plan()).not.toHaveTextContent('발표 목소리 연습')
  })
  it('서버 빈 목록과 조건으로 걸러진 빈 결과를 구별한다', async () => {
    const user = userEvent.setup()
    render(<CoursePlanPage loadCourses={vi.fn().mockResolvedValue(courses)} />)
    await screen.findByRole('radio', { name: /색으로 정리하는 메모/ })
    await user.type(time(), '10')
    expect(screen.getByText('시간에 맞는 강좌가 없어요. 상한을 늘려 보세요.')).toBeInTheDocument()
    cleanup()
    render(<CoursePlanPage loadCourses={vi.fn().mockResolvedValue([])} />)
    expect(await screen.findByText('등록된 강좌가 없어요.')).toBeInTheDocument()
    expect(screen.queryByText('시간에 맞는 강좌가 없어요. 상한을 늘려 보세요.')).not.toBeInTheDocument()
  })
  it('입력 범위를 벗어나면 필드 오류와 미선택 상태를 보여 준다', async () => {
    const user = userEvent.setup()
    render(<CoursePlanPage loadCourses={vi.fn().mockResolvedValue(courses)} />)
    await user.click(await screen.findByRole('radio', { name: /색으로 정리하는 메모/ }))
    await user.type(time(), '181')
    expect(time()).toBeInvalid()
    expect(screen.getByText('1분부터 180분까지 입력해 주세요.')).toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    expect(plan()).toHaveTextContent('아직 강좌를 고르지 않았어요.')
  })
})
