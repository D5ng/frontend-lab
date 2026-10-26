import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { places } from '../trip/data'
import type { TripApi } from '../trip/types'
import { DayTripPage } from './DayTripPage'
afterEach(cleanup)
function setup(overrides: Partial<TripApi> = {}) {
  const api = { getPlaces: vi.fn().mockResolvedValue(places), save: vi.fn().mockResolvedValue({ id: 'saved' }), ...overrides }
  render(<DayTripPage api={api} />)
  return { api, user: userEvent.setup() }
}
const summary = () => within(screen.getByRole('region', { name: '여행 일정 요약' }))
async function select(user: ReturnType<typeof userEvent.setup>, name: string) {
  await user.click(await screen.findByRole('checkbox', { name: name + ' 방문' }))
}
describe('하루 여행의 기존 행동', () => {
  it('서버 장소와 운영 시간을 표시하고 빈 일정 저장을 막는다', async () => {
    setup()
    await screen.findByRole('checkbox', { name: '숲길 정원 방문' })
    expect(screen.getByText('60분 · 4,000원 · 9시~18시')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '여행 일정 저장하기' })).toBeDisabled()
  })
  it('고른 순서에 체류와 이동을 누적하고 입장료를 합산한다', async () => {
    const { user } = setup()
    await select(user, '숲길 정원')
    await select(user, '작은 전시관')
    expect(summary().getByText('10:00–11:00')).toBeInTheDocument()
    expect(summary().getByText('11:15–12:45')).toBeInTheDocument()
    expect(summary().getByText('13,000원')).toBeInTheDocument()
  })
  it('앞으로 옮기면 순서와 도착 시간을 함께 다시 표시한다', async () => {
    const { user } = setup()
    await select(user, '숲길 정원')
    await select(user, '작은 전시관')
    await user.click(screen.getByRole('button', { name: '작은 전시관 앞으로' }))
    expect(summary().getByText('1. 작은 전시관')).toBeInTheDocument()
    expect(summary().getByText('11:45–12:45')).toBeInTheDocument()
  })
  it('예산 초과와 잘못된 숫자는 선택을 보존하며 저장을 막는다', async () => {
    const { user } = setup()
    await select(user, '숲길 정원')
    const budget = screen.getByRole('textbox', { name: '입장료 예산' })
    await user.clear(budget)
    await user.type(budget, '3000')
    expect(screen.getByRole('alert')).toHaveTextContent('1,000원 예산을 초과')
    expect(screen.getByRole('button', { name: '여행 일정 저장하기' })).toBeDisabled()
    await user.clear(budget)
    await user.type(budget, '-1')
    expect(budget).toHaveAttribute('aria-invalid', 'true')
  })
  it('운영 시간과 충돌하면 출발 변경을 안내하고 저장을 막는다', async () => {
    const { user } = setup()
    await select(user, '작은 전시관')
    await user.click(screen.getByRole('combobox', { name: '출발 시각' }))
    await user.click(screen.getByRole('option', { name: '17:00' }))
    expect(summary().getByText(/운영 시간에 맞지 않아요/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '여행 일정 저장하기' })).toBeDisabled()
  })
  it('실패해도 순서를 유지하고 다시 저장하며 요청에는 입력과 순서만 보낸다', async () => {
    const save = vi.fn().mockRejectedValueOnce(new Error('실패')).mockResolvedValueOnce({ id: 'saved' })
    const { user } = setup({ save })
    await select(user, '숲길 정원')
    await user.click(screen.getByRole('button', { name: '여행 일정 저장하기' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('일정을 저장하지 못했어요')
    expect(screen.getByRole('checkbox', { name: '숲길 정원 방문' })).toBeChecked()
    await user.click(screen.getByRole('button', { name: '여행 일정 저장하기' }))
    await screen.findByText('여행 일정을 저장했어요.')
    expect(save).toHaveBeenLastCalledWith({ startHour: 10, budget: 15000, placeIds: ['garden'] })
  })
  it('저장 중 입력을 잠그고 성공 결과는 이후 편집과 구분한다', async () => {
    let resolve!: (value: { id: string }) => void
    const promise = new Promise<{ id: string }>((complete) => {
      resolve = complete
    })
    const { user } = setup({ save: () => promise })
    await select(user, '숲길 정원')
    await user.click(screen.getByRole('button', { name: '여행 일정 저장하기' }))
    expect(screen.getByRole('textbox', { name: '입장료 예산' })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: '작은 전시관 방문' })).toBeDisabled()
    await act(async () => resolve({ id: 'saved' }))
    await screen.findByText('여행 일정을 저장했어요.')
    await select(user, '작은 전시관')
    expect(within(screen.getByRole('region', { name: '마지막 저장 일정' })).getByText(/숲길 정원/)).not.toHaveTextContent('작은 전시관')
  })
  it('조회 실패를 다시 불러올 수 있고 빈 목록은 오류와 구분한다', async () => {
    const getPlaces = vi.fn().mockRejectedValueOnce(new Error('실패')).mockResolvedValueOnce([])
    const { user } = setup({ getPlaces })
    await screen.findByRole('alert')
    await user.click(screen.getByRole('button', { name: '장소 다시 불러오기' }))
    expect(await screen.findByText('오늘 추천 장소가 없어요.')).toBeInTheDocument()
  })
})
