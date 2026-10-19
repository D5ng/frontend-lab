import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ReservationReviewPage } from './ReservationReviewPage'
import type { Quote, Receipt, ReservationApi } from '../features/reservationReview/types/reservation'

afterEach(cleanup)
const quote: Quote = { quoteId: 'quote-two', count: 2, totalPrice: 27100 }
const receipt: Receipt = { reservationId: 'reserved-two', count: 2, totalPrice: 27100 }
function setup() {
  const api = {
    getQuote: vi.fn<ReservationApi['getQuote']>().mockResolvedValue(quote),
    confirm: vi.fn<ReservationApi['confirm']>().mockResolvedValue(receipt),
  }
  render(<ReservationReviewPage api={api} />)
  return { api, user: userEvent.setup() }
}
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const promise = new Promise<T>((done, fail) => {
    resolve = done
    reject = fail
  })
  return { promise, resolve, reject }
}
async function checkTwo(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('radio', { name: '2명' }))
  await user.click(screen.getByRole('button', { name: '예약 금액 확인' }))
  await screen.findByText('확인한 금액: 27,100원')
}

describe('금액 확인과 예약 확정의 외부 행동', () => {
  it('진입 시 1명이고 확인 전에는 예약 요청하지 않는다', () => {
    const { api } = setup()
    expect(screen.getByRole('radio', { name: '1명' })).toBeChecked()
    expect(screen.getByText('아직 확인한 금액이 없어요.')).toBeVisible()
    expect(api.getQuote).not.toHaveBeenCalled()
    expect(api.confirm).not.toHaveBeenCalled()
  })
  it('선택한 인원으로 금액만 확인하고 서버 금액을 그대로 표시한다', async () => {
    const { api, user } = setup()
    await checkTwo(user)
    expect(api.getQuote).toHaveBeenCalledExactlyOnceWith(2)
    expect(api.confirm).not.toHaveBeenCalled()
    expect(screen.getByText('확인한 인원: 2명')).toBeVisible()
    expect(screen.getByRole('button', { name: '이 금액으로 예약 확정' })).toBeEnabled()
  })
  it('금액 확인 중 입력과 버튼을 잠그고 중복 요청하지 않는다', async () => {
    const { api, user } = setup()
    const pending = deferred<Quote>()
    api.getQuote.mockReturnValue(pending.promise)
    await user.click(screen.getByRole('button', { name: '예약 금액 확인' }))
    expect(screen.getByRole('radio', { name: '2명' })).toBeDisabled()
    const button = screen.getByRole('button', { name: /금액 확인 중/ })
    expect(button).toBeDisabled()
    await user.click(button)
    expect(api.getQuote).toHaveBeenCalledTimes(1)
    await act(async () => pending.resolve({ ...quote, count: 1 }))
    expect(screen.getByRole('button', { name: '이 금액으로 예약 확정' })).toBeEnabled()
  })
  it('금액 확인 실패는 같은 인원으로 다시 확인할 수 있다', async () => {
    const { api, user } = setup()
    api.getQuote.mockRejectedValueOnce(new Error('offline'))
    await user.click(screen.getByRole('radio', { name: '2명' }))
    await user.click(screen.getByRole('button', { name: '예약 금액 확인' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('금액을 확인하지 못했어요.')
    expect(screen.getByRole('radio', { name: '2명' })).toBeChecked()
    await user.click(screen.getByRole('button', { name: '예약 금액 확인' }))
    await screen.findByText('확인한 금액: 27,100원')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(api.getQuote).toHaveBeenNthCalledWith(2, 2)
  })
  it('확인 후 인원을 바꾸면 금액을 폐기하고 새로 확인해야 한다', async () => {
    const { api, user } = setup()
    await checkTwo(user)
    await user.click(screen.getByRole('radio', { name: '3명' }))
    expect(screen.queryByText('확인한 금액: 27,100원')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '이 금액으로 예약 확정' })).not.toBeInTheDocument()
    api.getQuote.mockResolvedValueOnce({ quoteId: 'quote-three', count: 3, totalPrice: 41300 })
    await user.click(screen.getByRole('button', { name: '예약 금액 확인' }))
    await screen.findByText('확인한 금액: 41,300원')
    await user.click(screen.getByRole('button', { name: '이 금액으로 예약 확정' }))
    expect(api.confirm).toHaveBeenCalledWith('quote-three')
  })
  it('확정 실패는 확인 결과를 보존하고 같은 quoteId로 재시도한다', async () => {
    const { api, user } = setup()
    api.confirm.mockRejectedValueOnce(new Error('offline'))
    await checkTwo(user)
    await user.click(screen.getByRole('button', { name: '이 금액으로 예약 확정' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('확인한 금액으로 다시 시도해 주세요.')
    expect(screen.getByText('확인한 금액: 27,100원')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '이 금액으로 예약 확정' }))
    await screen.findByText('확정 금액: 27,100원')
    expect(api.confirm.mock.calls).toEqual([['quote-two'], ['quote-two']])
    expect(api.getQuote).toHaveBeenCalledTimes(1)
  })
  it('확정 실패 후 인원을 바꾸면 오류와 이전 금액을 지운다', async () => {
    const { api, user } = setup()
    api.confirm.mockRejectedValueOnce(new Error('offline'))
    await checkTwo(user)
    await user.click(screen.getByRole('button', { name: '이 금액으로 예약 확정' }))
    await screen.findByRole('alert')
    await user.click(screen.getByRole('radio', { name: '1명' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByText('아직 확인한 금액이 없어요.')).toBeVisible()
    expect(screen.getByRole('button', { name: '예약 금액 확인' })).toBeEnabled()
  })
  it('확정 중 입력을 잠그고 성공 후 서버 영수증을 표시하며 재전송을 막는다', async () => {
    const { api, user } = setup()
    const pending = deferred<Receipt>()
    api.confirm.mockReturnValue(pending.promise)
    await checkTwo(user)
    await user.click(screen.getByRole('button', { name: '이 금액으로 예약 확정' }))
    expect(screen.getByRole('radio', { name: '3명' })).toBeDisabled()
    const button = screen.getByRole('button', { name: /예약 확정 중/ })
    expect(button).toBeDisabled()
    await user.click(button)
    expect(api.confirm).toHaveBeenCalledExactlyOnceWith('quote-two')
    await act(async () => pending.resolve({ ...receipt, totalPrice: 26900 }))
    expect(screen.getByText('확정 금액: 26,900원')).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('예약을 완료했어요.')
    expect(screen.getByRole('button', { name: '예약 완료' })).toBeDisabled()
    expect(screen.getByRole('radio', { name: '2명' })).toBeDisabled()
  })
})
