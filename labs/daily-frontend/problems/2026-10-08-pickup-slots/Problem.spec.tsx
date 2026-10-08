import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createPickupMock, slotsByDay, type Slot } from './api'
import { previews } from './preview'
import { PickupPlanner } from './starter'
import { PickupView } from './view'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function deferred<T>() {
  let resolve: (value: T) => void = () => {}
  let reject: (error: Error) => void = () => {}
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('제공 UI와 API', () => {
  it('날짜·시간 라벨과 실제 사용자 조작을 전달한다', async () => {
    const user = userEvent.setup()
    const onDayChange = vi.fn(),
      onSlotChange = vi.fn(),
      onReload = vi.fn(),
      onReserve = vi.fn()
    render(
      <PickupView
        {...previews.selected!}
        onDayChange={onDayChange}
        onSlotChange={onSlotChange}
        onReload={onReload}
        onReserve={onReserve}
      />,
    )
    expect(screen.getByRole('radiogroup', { name: '픽업 날짜' })).toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: '픽업 시간' })).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: '내일' }))
    await user.click(screen.getByRole('radio', { name: '오후 7시' }))
    await user.click(screen.getByRole('button', { name: '시간 다시 불러오기' }))
    await user.click(screen.getByRole('button', { name: '픽업 예약하기' }))
    expect(onDayChange).toHaveBeenCalledWith('tomorrow')
    expect(onSlotChange).toHaveBeenCalledWith('today-19')
    expect(onReload).toHaveBeenCalledOnce()
    expect(onReserve).toHaveBeenCalledOnce()
  })
  it.each(['ready', 'loading', 'empty', 'error', 'reserving', 'success'])('고정 화면의 예약 비활성 상태: %s', (name) => {
    render(<PickupView {...previews[name]!} />)
    expect(screen.getByRole('button', { name: name === 'reserving' ? '픽업 예약 중' : '픽업 예약하기' })).toBeDisabled()
    if (name === 'loading') expect(screen.getByRole('radio', { name: '오늘' })).toBeEnabled()
    if (name === 'reserving') expect(screen.getByRole('radio', { name: '오늘' })).toBeDisabled()
    if (name === 'error') expect(screen.getByRole('alert')).toHaveTextContent('다시 불러와 주세요.')
  })
  it('모의 조회의 첫 내일 실패와 재시도·응답 복사 계약을 검증한다', async () => {
    vi.useFakeTimers()
    const api = createPickupMock()
    const failure = expect(api.loadSlots('tomorrow')).rejects.toThrow('시간 조회 실패')
    await vi.advanceTimersByTimeAsync(500)
    await failure
    const next = api.loadSlots('tomorrow')
    await vi.advanceTimersByTimeAsync(500)
    const result = await next
    expect(result).toEqual(slotsByDay.tomorrow)
    result[0]!.label = '수정'
    expect(slotsByDay.tomorrow[0]!.label).toBe('오전 10시')
  })
  it('모의 예약의 첫 실패 후 올바른 재시도는 성공한다', async () => {
    vi.useFakeTimers()
    const api = createPickupMock()
    const first = expect(api.reserveSlot({ day: 'today', slotId: 'today-18' })).rejects.toThrow('예약 실패')
    await vi.advanceTimersByTimeAsync(1000)
    await first
    const retry = expect(api.reserveSlot({ day: 'today', slotId: 'today-18' })).resolves.toBeUndefined()
    await vi.advanceTimersByTimeAsync(1000)
    await retry
  })
})

// 풀이 시작 시 .skip을 제거하세요. 아래는 구현 전이라 실패해야 하는 행동 계약입니다.
describe.skip('직접 구현할 조회·선택·예약 행동', () => {
  it('오늘을 조회하고 시간을 직접 선택한 뒤 올바른 요청을 보낸다', async () => {
    const user = userEvent.setup()
    const loadSlots = vi.fn().mockResolvedValue(slotsByDay.today),
      reserveSlot = vi.fn().mockResolvedValue(undefined)
    render(<PickupPlanner loadSlots={loadSlots} reserveSlot={reserveSlot} />)
    await screen.findByRole('radio', { name: '오후 6시' })
    expect(loadSlots).toHaveBeenCalledWith('today')
    expect(screen.getByRole('button', { name: '픽업 예약하기' })).toBeDisabled()
    await user.click(screen.getByRole('radio', { name: '오후 6시' }))
    await user.click(screen.getByRole('button', { name: '픽업 예약하기' }))
    expect(reserveSlot).toHaveBeenCalledExactlyOnceWith({ day: 'today', slotId: 'today-18' })
    expect(await screen.findByRole('status')).toHaveTextContent('오늘 오후 6시 픽업을 예약했어요.')
    expect(screen.getByRole('button', { name: '픽업 예약하기' })).toBeDisabled()
  })
  it.each(['resolve', 'reject'] as const)('이전 응답의 %s가 내일의 성공 목록을 덮지 않는다', async (completion) => {
    const user = userEvent.setup(),
      old = deferred<Slot[]>()
    const loadSlots = vi.fn().mockReturnValueOnce(old.promise).mockResolvedValueOnce(slotsByDay.tomorrow)
    render(<PickupPlanner loadSlots={loadSlots} reserveSlot={vi.fn()} />)
    await user.click(screen.getByRole('radio', { name: '내일' }))
    await screen.findByRole('radio', { name: '오전 10시' })
    await act(async () => {
      if (completion === 'resolve') old.resolve(slotsByDay.today)
      else old.reject(new Error('오래된 실패'))
    })
    expect(screen.getByRole('radio', { name: '오전 10시' })).toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: '오후 6시' })).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
  it('오늘→내일→오늘에서 오래된 오늘 완료가 새 오늘 로딩을 끝내지 않는다', async () => {
    const user = userEvent.setup(),
      first = deferred<Slot[]>(),
      middle = deferred<Slot[]>(),
      latest = deferred<Slot[]>()
    const loadSlots = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(middle.promise).mockReturnValueOnce(latest.promise)
    render(<PickupPlanner loadSlots={loadSlots} reserveSlot={vi.fn()} />)
    await user.click(screen.getByRole('radio', { name: '내일' }))
    await user.click(screen.getByRole('radio', { name: '오늘' }))
    await act(async () => first.resolve([{ id: 'obsolete', label: '지난 조회 시간' }]))
    expect(screen.getByRole('status', { name: '시간 조회 중' })).toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: '지난 조회 시간' })).not.toBeInTheDocument()
    await act(async () => latest.resolve(slotsByDay.today))
    await act(async () => middle.reject(new Error('지난 날짜 실패')))
    expect(screen.getByRole('radio', { name: '오후 6시' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
  it('날짜 변경·재조회에서 선택을 지우고 실패·빈 배열을 구분한다', async () => {
    const user = userEvent.setup(),
      reloading = deferred<Slot[]>()
    const loadSlots = vi
      .fn()
      .mockResolvedValueOnce(slotsByDay.today)
      .mockReturnValueOnce(reloading.promise)
      .mockRejectedValueOnce(new Error('실패'))
      .mockResolvedValueOnce([])
    render(<PickupPlanner loadSlots={loadSlots} reserveSlot={vi.fn()} />)
    await user.click(await screen.findByRole('radio', { name: '오후 6시' }))
    await user.click(screen.getByRole('button', { name: '시간 다시 불러오기' }))
    expect(screen.queryByRole('radio', { name: '오후 6시' })).not.toBeInTheDocument()
    await act(async () => reloading.resolve(slotsByDay.today))
    expect(screen.getByRole('radio', { name: '오후 6시' })).not.toBeChecked()
    await user.click(screen.getByRole('radio', { name: '오후 6시' }))
    await user.click(screen.getByRole('radio', { name: '내일' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('시간을 불러오지 못했어요.')
    await user.click(screen.getByRole('button', { name: '시간 다시 불러오기' }))
    expect(await screen.findByText('예약 가능한 시간이 없어요. 다른 날짜를 골라 주세요.')).toBeInTheDocument()
    expect(loadSlots).toHaveBeenLastCalledWith('tomorrow')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
  it('예약 중 모든 조작을 잠그고 실패 후 선택 보존·재시도를 제공한다', async () => {
    const user = userEvent.setup(),
      pending = deferred<void>(),
      retry = deferred<void>()
    const reserveSlot = vi.fn().mockReturnValueOnce(pending.promise).mockReturnValueOnce(retry.promise)
    render(<PickupPlanner loadSlots={vi.fn().mockResolvedValue(slotsByDay.today)} reserveSlot={reserveSlot} />)
    await user.click(await screen.findByRole('radio', { name: '오후 6시' }))
    await user.click(screen.getByRole('button', { name: '픽업 예약하기' }))
    expect(screen.getByRole('radio', { name: '내일' })).toBeDisabled()
    expect(screen.getByRole('radio', { name: '오후 7시' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '시간 다시 불러오기' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: '픽업 예약 중' }))
    expect(reserveSlot).toHaveBeenCalledOnce()
    await act(async () => pending.reject(new Error('실패')))
    expect(screen.getByRole('radio', { name: '오후 6시' })).toBeChecked()
    expect(screen.getByRole('alert')).toHaveTextContent('선택한 시간으로 다시 시도해 주세요.')
    await user.click(screen.getByRole('button', { name: '픽업 예약하기' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    await act(async () => retry.resolve())
    expect(screen.getByRole('status')).toHaveTextContent('오늘 오후 6시 픽업을 예약했어요.')
    await user.click(screen.getByRole('radio', { name: '오후 7시' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '픽업 예약하기' })).toBeEnabled()
  })
})
