import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CancellationPage } from './starter'
import { createDemoCancellation } from './api'

afterEach(cleanup)

async function selectToday(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('radio', { name: '오늘 · 가죽 키링 클래스' }))
}

describe('예약 취소의 외부 행동', () => {
  it('전날 예약의 전액 환불 안내와 요청 금액이 일치한다', async () => {
    const user = userEvent.setup()
    const cancel = vi.fn().mockResolvedValue(undefined)
    render(<CancellationPage cancelReservation={cancel} />)
    expect(screen.getByTestId('fee')).toHaveTextContent('0원')
    expect(screen.getByTestId('refund')).toHaveTextContent('12,000원')
    await user.type(screen.getByRole('textbox', { name: '취소 사유' }), '  개인 일정이 생겼어요  ')
    await user.click(screen.getByRole('button', { name: '예약 취소하기' }))
    expect(cancel).toHaveBeenCalledExactlyOnceWith({ reservationId: 'tomorrow', reason: '개인 일정이 생겼어요', fee: 0, refund: 12000 })
    expect(await screen.findByText('이미 취소한 예약이에요.')).toBeVisible()
    expect(screen.getByRole('textbox')).toHaveValue('')
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('당일 예약의 수수료를 화면과 요청에 동일하게 적용한다', async () => {
    const user = userEvent.setup()
    const cancel = vi.fn().mockResolvedValue(undefined)
    render(<CancellationPage cancelReservation={cancel} />)
    await selectToday(user)
    expect(screen.getByTestId('fee')).toHaveTextContent('2,000원')
    expect(screen.getByTestId('refund')).toHaveTextContent('16,000원')
    expect(screen.getByText('당일 취소는 수수료 2,000원이 차감돼요.')).toBeVisible()
    await user.type(screen.getByRole('textbox'), '일정 변경으로 취소해요')
    await user.click(screen.getByRole('button'))
    expect(cancel).toHaveBeenCalledExactlyOnceWith({ reservationId: 'today', reason: '일정 변경으로 취소해요', fee: 2000, refund: 16000 })
  })

  it('공백을 제외한 사유가 5자 미만이면 요청하지 않고 수정 시 오류를 지운다', async () => {
    const user = userEvent.setup()
    const cancel = vi.fn()
    render(<CancellationPage cancelReservation={cancel} />)
    const input = screen.getByRole('textbox')
    await user.type(input, '  변경  ')
    await user.click(screen.getByRole('button'))
    expect(cancel).not.toHaveBeenCalled()
    expect(screen.getByText('취소 사유를 5자 이상 입력해 주세요.')).toBeVisible()
    await user.type(input, '합니다')
    expect(screen.queryByText('취소 사유를 5자 이상 입력해 주세요.')).not.toBeInTheDocument()
  })

  it('시작한 예약은 취소 불가를 안내하고 입력과 제출을 잠근다', async () => {
    const user = userEvent.setup()
    const cancel = vi.fn()
    render(<CancellationPage cancelReservation={cancel} />)
    await user.click(screen.getByRole('radio', { name: '진행 중 · 수채화 클래스' }))
    expect(screen.getByText('시작한 클래스는 취소할 수 없어요.')).toBeVisible()
    expect(screen.getByTestId('refund')).toHaveTextContent('환불 불가')
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('button')).toBeDisabled()
    await user.click(screen.getByRole('button'))
    expect(cancel).not.toHaveBeenCalled()
  })

  it('대기 중 모든 조작을 잠그고 성공 후 선택된 예약만 취소 상태로 유지한다', async () => {
    const user = userEvent.setup()
    let finish: () => void = () => {}
    const cancel = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve
        }),
    )
    render(<CancellationPage cancelReservation={cancel} />)
    await user.type(screen.getByRole('textbox'), '다른 일정이 생겼어요')
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('button', { name: '취소 중...' })).toBeDisabled()
    expect(screen.getByRole('textbox')).toBeDisabled()
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled()
    await user.click(screen.getByRole('button'))
    expect(cancel).toHaveBeenCalledTimes(1)
    await act(async () => finish())
    expect(screen.getByRole('status')).toHaveTextContent('예약을 취소했어요.')
    await selectToday(user)
    expect(screen.getByRole('button')).toBeEnabled()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    await user.click(screen.getByRole('radio', { name: '내일 · 도자기 원데이 클래스' }))
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByText('이미 취소한 예약이에요.')).toBeVisible()
  })

  it('실패하면 사유와 예약을 보존하고 같은 내용으로 재시도할 수 있다', async () => {
    const user = userEvent.setup()
    const cancel = vi.fn().mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce(undefined)
    render(<CancellationPage cancelReservation={cancel} />)
    await selectToday(user)
    await user.type(screen.getByRole('textbox'), '개인 일정이 생겼어요')
    await user.click(screen.getByRole('button'))
    expect(await screen.findByText('취소하지 못했어요. 입력한 사유를 확인하고 다시 시도해 주세요.')).toBeVisible()
    expect(screen.getByRole('textbox')).toHaveValue('개인 일정이 생겼어요')
    expect(screen.getByRole('button')).toBeEnabled()
    await user.click(screen.getByRole('button'))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('예약을 취소했어요.'))
    expect(cancel).toHaveBeenCalledTimes(2)
    expect(cancel.mock.calls[0]).toEqual(cancel.mock.calls[1])
  })

  it('선택을 바꾸면 이전 예약의 사유와 오류를 지운다', async () => {
    const user = userEvent.setup()
    render(<CancellationPage cancelReservation={vi.fn()} />)
    await user.type(screen.getByRole('textbox'), '짧음')
    await user.click(screen.getByRole('button'))
    await selectToday(user)
    expect(screen.getByRole('textbox')).toHaveValue('')
    expect(screen.queryByText('취소 사유를 5자 이상 입력해 주세요.')).not.toBeInTheDocument()
  })
})

it('브라우저 모의 API는 첫 요청만 실패하며 재진입 시 새 함수로 초기화된다', async () => {
  vi.useFakeTimers()
  try {
    const request = { reservationId: 'tomorrow', reason: '일정이 생겼어요', fee: 0, refund: 12000 }
    const api = createDemoCancellation()
    const first = expect(api(request)).rejects.toThrow('temporary failure')
    await vi.advanceTimersByTimeAsync(900)
    await first
    const next = expect(api(request)).resolves.toBeUndefined()
    await vi.advanceTimersByTimeAsync(900)
    await next
    const reset = expect(createDemoCancellation()(request)).rejects.toThrow('temporary failure')
    await vi.advanceTimersByTimeAsync(900)
    await reset
  } finally {
    vi.useRealTimers()
  }
})
