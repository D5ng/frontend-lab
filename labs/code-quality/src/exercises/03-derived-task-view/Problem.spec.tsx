import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Problem } from './Problem'
import type { DailyTask } from './model/task'

describe('생활 할 일', () => {
  it('할 일 현황과 전체 목록을 보여준다', () => {
    render(<Problem />)

    expect(screen.getByText('오늘 남은 일 2개')).toBeVisible()
    expect(screen.getByRole('progressbar', { name: '오늘의 할 일 진행률' })).toHaveAttribute('aria-valuenow', '50')
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('상태 필터에 맞는 할 일만 보여준다', async () => {
    const user = userEvent.setup()
    render(<Problem />)

    await user.click(screen.getByRole('button', { name: '할 일 2' }))

    expect(screen.getByText('분리수거함 내놓기')).toBeVisible()
    expect(screen.getByText('반려견 예방접종 예약')).toBeVisible()
    expect(screen.queryByText('세탁소에서 겨울 이불 찾기')).not.toBeInTheDocument()
  })

  it('현재 상태 필터 안에서 제목을 검색한다', async () => {
    const user = userEvent.setup()
    render(<Problem />)

    await user.click(screen.getByRole('button', { name: '완료 2' }))
    await user.type(screen.getByRole('searchbox', { name: '할 일 검색' }), '세탁소')

    expect(screen.getByText('세탁소에서 겨울 이불 찾기')).toBeVisible()
    expect(screen.queryByText('주말 장보기 목록 정리')).not.toBeInTheDocument()
  })

  it('완료 상태를 바꾸면 현황과 필터 개수를 함께 갱신한다', async () => {
    const user = userEvent.setup()
    render(<Problem />)

    await user.click(screen.getByRole('checkbox', { name: '반려견 예방접종 예약 완료로 표시' }))

    expect(screen.getByText('오늘 남은 일 1개')).toBeVisible()
    expect(screen.getByRole('button', { name: '할 일 1' })).toBeVisible()
    expect(screen.getByRole('button', { name: '완료 3' })).toBeVisible()
    expect(screen.getByRole('progressbar', { name: '오늘의 할 일 진행률' })).toHaveAttribute('aria-valuenow', '75')
  })

  it('완료한 할 일을 목록에서 정리한다', async () => {
    const user = userEvent.setup()
    render(<Problem />)

    await user.click(screen.getByRole('button', { name: '완료한 일 정리 2' }))

    expect(screen.queryByText('세탁소에서 겨울 이불 찾기')).not.toBeInTheDocument()
    expect(screen.queryByText('주말 장보기 목록 정리')).not.toBeInTheDocument()
    expect(screen.getByText('완료한 할 일 2개를 정리했어요.')).toBeVisible()
    expect(screen.getByRole('button', { name: '완료한 일 정리 0' })).toBeDisabled()
  })

  it('제목이 같아도 완료한 항목만 정리한다', async () => {
    const user = userEvent.setup()
    const tasks: DailyTask[] = [
      {
        id: 'morning-groceries',
        title: '장보기',
        category: 'shopping',
        due: '오늘 오전',
        place: '시장',
        completed: true,
      },
      {
        id: 'evening-groceries',
        title: '장보기',
        category: 'shopping',
        due: '오늘 저녁',
        place: '마트',
        completed: false,
      },
    ]
    render(<Problem initialTasks={tasks} />)

    await user.click(screen.getByRole('button', { name: '완료한 일 정리 1' }))

    const remainingTask = screen.getByRole('listitem')
    expect(within(remainingTask).getByRole('heading', { name: '장보기' })).toBeVisible()
    expect(within(remainingTask).getByText('오늘 저녁')).toBeVisible()
    expect(within(remainingTask).getByRole('checkbox', { name: '장보기 완료로 표시' })).toBeVisible()
  })
})
