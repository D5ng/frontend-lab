import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createNotificationMock } from './api'
import { NotificationSettings } from './starter'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function deferred() {
  let resolve: () => void = () => {}
  let reject: (error: Error) => void = () => {}
  const promise = new Promise<void>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const toggle = (title: string) => screen.getByRole('switch', { name: `${title} 알림` })
const row = (title: string) => within(screen.getByRole('region', { name: title }))

describe('상품별 알림의 기존 행동', () => {
  it('초기 설정과 개수를 표시한다', () => {
    render(<NotificationSettings updateNotification={vi.fn()} />)
    expect(toggle('원목 책상')).not.toBeChecked()
    expect(toggle('소설 전집')).toBeChecked()
    expect(toggle('작은 화분')).not.toBeChecked()
    expect(screen.getByText('알림 켠 상품 1개')).toBeInTheDocument()
  })

  it('즉시 반영하고 요청 중인 상품만 막으며 중복 전송하지 않는다', async () => {
    const user = userEvent.setup()
    const request = deferred()
    const update = vi.fn().mockReturnValue(request.promise)
    render(<NotificationSettings updateNotification={update} />)
    await user.click(toggle('원목 책상'))
    expect(toggle('원목 책상')).toBeChecked()
    expect(toggle('원목 책상')).toBeDisabled()
    expect(toggle('소설 전집')).toBeEnabled()
    expect(screen.getByText('알림 켠 상품 2개')).toBeInTheDocument()
    expect(row('원목 책상').getByRole('status')).toHaveTextContent('변경 중…')
    await user.click(toggle('원목 책상'))
    expect(update).toHaveBeenCalledExactlyOnceWith({ productId: 'desk', enabled: true })
    await act(async () => request.resolve())
    expect(toggle('원목 책상')).toBeEnabled()
    expect(row('원목 책상').getByRole('status')).toHaveTextContent('알림을 켰어요.')
  })

  it.each(['success-first', 'failure-first'])('동시 요청에서 실패한 상품만 복구한다: %s', async (order) => {
    const user = userEvent.setup()
    const desk = deferred()
    const books = deferred()
    const update = vi.fn(({ productId }: { productId: string; enabled: boolean }) => (productId === 'desk' ? desk.promise : books.promise))
    render(<NotificationSettings updateNotification={update} />)
    await user.click(toggle('원목 책상'))
    await user.click(toggle('소설 전집'))
    expect(update).toHaveBeenNthCalledWith(2, { productId: 'books', enabled: false })
    expect(screen.getByText('알림 켠 상품 1개')).toBeInTheDocument()
    if (order === 'success-first') {
      await act(async () => books.resolve())
      expect(toggle('원목 책상')).toBeDisabled()
      expect(row('소설 전집').getByRole('status')).toHaveTextContent('알림을 껐어요.')
      await act(async () => desk.reject(new Error('실패')))
    } else {
      await act(async () => desk.reject(new Error('실패')))
      expect(toggle('소설 전집')).toBeDisabled()
      expect(row('소설 전집').getByRole('status')).toHaveTextContent('변경 중…')
      expect(screen.getByText('알림 켠 상품 0개')).toBeInTheDocument()
      await act(async () => books.resolve())
    }
    expect(toggle('원목 책상')).not.toBeChecked()
    expect(toggle('소설 전집')).not.toBeChecked()
    expect(toggle('소설 전집')).toBeEnabled()
    expect(row('원목 책상').getByRole('alert')).toHaveTextContent('이전 설정으로 돌아갔어요.')
    expect(row('소설 전집').getByRole('status')).toHaveTextContent('알림을 껐어요.')
    expect(screen.getByText('알림 켠 상품 0개')).toBeInTheDocument()
  })

  it('끔 요청 실패도 원래 켜짐으로 되돌린다', async () => {
    const user = userEvent.setup()
    render(<NotificationSettings updateNotification={vi.fn().mockRejectedValue(new Error('실패'))} />)
    await user.click(toggle('소설 전집'))
    expect(toggle('소설 전집')).toBeChecked()
    expect(toggle('소설 전집')).toBeEnabled()
    expect(row('소설 전집').getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('알림 켠 상품 1개')).toBeInTheDocument()
  })

  it('재시도는 해당 오류만 지우고 다른 상품 성공 안내를 유지한다', async () => {
    const user = userEvent.setup()
    const retry = deferred()
    const update = vi.fn().mockRejectedValueOnce(new Error('실패')).mockResolvedValueOnce(undefined).mockReturnValueOnce(retry.promise)
    render(<NotificationSettings updateNotification={update} />)
    await user.click(toggle('원목 책상'))
    await user.click(toggle('작은 화분'))
    expect(row('원목 책상').getByRole('alert')).toBeInTheDocument()
    await user.click(toggle('원목 책상'))
    expect(row('원목 책상').queryByRole('alert')).not.toBeInTheDocument()
    expect(row('작은 화분').getByRole('status')).toHaveTextContent('알림을 켰어요.')
    expect(screen.getByText('알림 켠 상품 3개')).toBeInTheDocument()
    await act(async () => retry.resolve())
    expect(toggle('원목 책상')).toBeChecked()
    expect(row('원목 책상').getByRole('status')).toHaveTextContent('알림을 켰어요.')
  })

  it('키보드로도 행을 전환한다', async () => {
    const user = userEvent.setup()
    const update = vi.fn().mockResolvedValue(undefined)
    render(<NotificationSettings updateNotification={update} />)
    toggle('원목 책상').focus()
    await user.keyboard(' ')
    expect(update).toHaveBeenCalledExactlyOnceWith({ productId: 'desk', enabled: true })
    expect(toggle('원목 책상')).toBeChecked()
  })

  it('모의 API는 책상 첫 요청만 실패하고 다른 상품 및 재시도는 성공한다', async () => {
    vi.useFakeTimers()
    const update = createNotificationMock()
    const first = expect(update({ productId: 'desk', enabled: true })).rejects.toThrow('설정 변경 실패')
    const other = expect(update({ productId: 'books', enabled: false })).resolves.toBeUndefined()
    await vi.advanceTimersByTimeAsync(1800)
    await Promise.all([first, other])
    const retry = expect(update({ productId: 'desk', enabled: true })).resolves.toBeUndefined()
    await vi.advanceTimersByTimeAsync(1800)
    await retry
  })
})
