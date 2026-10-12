import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createReadMock, notifications } from './api'
import { NotificationInbox } from './starter'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})
function deferred() {
  let resolve: () => void = () => {}
  let reject: (error: Error) => void = () => {}
  const promise = new Promise<void>((complete, fail) => {
    resolve = complete
    reject = fail
  })
  return { promise, resolve, reject }
}
function checkbox(index: number) {
  return screen.getByRole('checkbox', { name: notifications[index].title })
}
function row(index: number) {
  const label = checkbox(index).closest('label')
  if (!label) throw new Error('입력 라벨이 없습니다')
  return within(label)
}

describe('일괄 읽음 처리의 기존 사용자 행동', () => {
  it('초기 상태는 안 읽은 3개·선택 0개이며 읽은 행과 실행 버튼은 잠겨 있다', async () => {
    const user = userEvent.setup(),
      markRead = vi.fn()
    render(<NotificationInbox markRead={markRead} />)
    expect(screen.getByText('안 읽은 알림 3개 · 선택 0개')).toBeVisible()
    expect(checkbox(3)).toBeDisabled()
    expect(row(3).getByText('읽음')).toBeVisible()
    expect(screen.getByRole('button', { name: '선택한 0개 읽음 처리' })).toBeDisabled()
    await user.click(checkbox(3))
    await user.click(screen.getByRole('button'))
    expect(markRead).not.toHaveBeenCalled()
  })
  it('행 전체로 선택·해제하며 선택 순서와 무관하게 목록 순서로 요청한다', async () => {
    const user = userEvent.setup(),
      pending = deferred(),
      markRead = vi.fn().mockReturnValue(pending.promise)
    render(<NotificationInbox markRead={markRead} />)
    await user.click(screen.getByText(notifications[1].title))
    await user.click(screen.getByText(notifications[0].description))
    expect(checkbox(0)).toBeChecked()
    expect(checkbox(1)).toBeChecked()
    await user.click(checkbox(2))
    await user.click(checkbox(2))
    expect(checkbox(2)).not.toBeChecked()
    await user.click(screen.getByRole('button', { name: '선택한 2개 읽음 처리' }))
    expect(markRead).toHaveBeenCalledExactlyOnceWith(['chat', 'price'])
    expect(checkbox(0)).toBeDisabled()
    expect(checkbox(1)).toBeDisabled()
    expect(checkbox(2)).toBeEnabled()
    expect(row(0).getByText('처리 중')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '읽음 처리 중' }))
    expect(markRead).toHaveBeenCalledOnce()
    await act(async () => pending.resolve())
  })
  it('성공은 요청 대상만 읽음 처리하고 기다리는 동안 새 선택은 남긴다', async () => {
    const user = userEvent.setup(),
      pending = deferred(),
      markRead = vi.fn().mockReturnValueOnce(pending.promise).mockResolvedValueOnce(undefined)
    render(<NotificationInbox markRead={markRead} />)
    await user.click(checkbox(0))
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('status')).toHaveTextContent('1개 처리 중이에요.')
    await user.click(checkbox(0))
    expect(checkbox(0)).toBeChecked()
    await user.click(checkbox(1))
    expect(screen.getByText('안 읽은 알림 3개 · 선택 2개')).toBeVisible()
    await act(async () => pending.resolve())
    expect(row(0).getByText('읽음')).toBeVisible()
    expect(checkbox(0)).not.toBeChecked()
    expect(checkbox(0)).toBeDisabled()
    expect(checkbox(1)).toBeChecked()
    expect(checkbox(1)).toBeEnabled()
    expect(row(1).getByText('안 읽음')).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('1개 알림을 읽음 처리했어요.')
    expect(screen.getByText('안 읽은 알림 2개 · 선택 1개')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '선택한 1개 읽음 처리' }))
    expect(markRead).toHaveBeenNthCalledWith(2, ['price'])
  })
  it('실패는 현재 선택을 보존하고 재시도 시작은 안내를 지운다', async () => {
    const user = userEvent.setup(),
      first = deferred(),
      retry = deferred()
    const markRead = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(retry.promise)
    render(<NotificationInbox markRead={markRead} />)
    await user.click(checkbox(0))
    await user.click(screen.getByRole('button'))
    await user.click(checkbox(1))
    await user.click(checkbox(2))
    await user.click(checkbox(2))
    await act(async () => first.reject(new Error('실패')))
    expect(checkbox(0)).toBeChecked()
    expect(checkbox(1)).toBeChecked()
    expect(checkbox(2)).not.toBeChecked()
    expect(screen.getByText('안 읽은 알림 3개 · 선택 2개')).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('현재 선택으로 다시 시도해 주세요.')
    await user.click(screen.getByRole('button', { name: '선택한 2개 읽음 처리' }))
    expect(markRead).toHaveBeenNthCalledWith(2, ['chat', 'price'])
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    await act(async () => retry.resolve())
    expect(screen.getByRole('status')).toHaveTextContent('2개 알림을 읽음 처리했어요.')
  })
  it('실패 후 선택을 바꾸면 안내를 지우고 현재 선택만 재전송한다', async () => {
    const user = userEvent.setup(),
      markRead = vi.fn().mockRejectedValueOnce(new Error('실패')).mockResolvedValueOnce(undefined)
    render(<NotificationInbox markRead={markRead} />)
    await user.click(checkbox(0))
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('alert')).toBeVisible()
    await user.click(checkbox(0))
    await user.click(checkbox(2))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button'))
    expect(markRead).toHaveBeenNthCalledWith(2, ['club'])
    expect(row(0).getByText('안 읽음')).toBeVisible()
  })
  it('모두 읽으면 목록을 유지하고 선택·실행을 잠그며 완료 안내를 남긴다', async () => {
    const user = userEvent.setup(),
      markRead = vi.fn().mockResolvedValue(undefined)
    render(<NotificationInbox markRead={markRead} />)
    for (const index of [0, 1, 2]) await user.click(checkbox(index))
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('모든 알림을 확인했어요.')).toBeVisible()
    expect(screen.getByText('안 읽은 알림 0개 · 선택 0개')).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('3개 알림을 읽음 처리했어요.')
    expect(screen.getAllByRole('checkbox')).toHaveLength(4)
    for (const input of screen.getAllByRole('checkbox')) expect(input).toBeDisabled()
    expect(screen.getByRole('button')).toBeDisabled()
  })
  it('모의 API의 첫 요청은 실패하고 다음 요청은 성공한다', async () => {
    vi.useFakeTimers()
    const mark = createReadMock(),
      first = expect(mark(['chat'])).rejects.toThrow('읽음 처리 실패')
    await vi.advanceTimersByTimeAsync(1800)
    await first
    const second = expect(mark(['chat', 'price'])).resolves.toBeUndefined()
    await vi.advanceTimersByTimeAsync(1800)
    await second
  })
})
