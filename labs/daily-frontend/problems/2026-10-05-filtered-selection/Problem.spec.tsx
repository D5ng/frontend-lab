import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createDemoReservation } from './api'
import { ProductReservation } from './starter'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('관심 상품 예약의 기존 행동', () => {
  it('선택하지 않으면 금액은 0원이고 예약할 수 없다', () => {
    render(<ProductReservation reserveProducts={vi.fn()} />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
    expect(screen.getByText('선택 0개')).toBeVisible()
    expect(screen.getByText('상품 금액 0원')).toBeVisible()
    expect(screen.getByRole('button', { name: '선택 상품 예약하기' })).toBeDisabled()
  })

  it('나눔 상품만 선택해도 금액 0원으로 예약할 수 있다', async () => {
    const reserve = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<ProductReservation reserveProducts={reserve} />)
    await user.click(screen.getByRole('checkbox', { name: '작은 화분' }))
    await user.click(screen.getByRole('button', { name: '선택 상품 예약하기' }))
    expect(reserve).toHaveBeenCalledWith({ productIds: ['plant'], totalPrice: 0 })
    expect(await screen.findByText('선택한 상품을 예약했어요.')).toBeVisible()
  })

  it('필터로 숨겨진 선택도 개수·금액·예약 대상에 포함한다', async () => {
    const reserve = vi.fn().mockRejectedValue(new Error('실패'))
    const user = userEvent.setup()
    render(<ProductReservation reserveProducts={reserve} />)
    await user.click(screen.getByRole('checkbox', { name: '접이식 책상' }))
    await user.click(screen.getByRole('checkbox', { name: '작은 화분' }))
    await user.click(screen.getByRole('radio', { name: '나눔' }))
    expect(screen.queryByRole('checkbox', { name: '접이식 책상' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('checkbox')).toHaveLength(1)
    expect(screen.getByText('선택 2개')).toBeVisible()
    expect(screen.getByText('상품 금액 12,000원')).toBeVisible()
    expect(screen.getByText('현재 목록에서 숨겨진 선택 상품 1개도 예약에 포함돼요.')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '선택 상품 예약하기' }))
    expect(reserve).toHaveBeenCalledWith({ productIds: ['desk', 'plant'], totalPrice: 12000 })
    expect(await screen.findByRole('alert')).toBeVisible()
    await user.click(screen.getByRole('radio', { name: '전체' }))
    expect(screen.getByRole('checkbox', { name: '접이식 책상' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: '작은 화분' })).toBeChecked()
  })

  it('선택 해제는 해당 상품만 제거하고 요청은 원래 상품 순서를 따른다', async () => {
    const reserve = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<ProductReservation reserveProducts={reserve} />)
    for (const title of ['작은 화분', '소설책 세 권', '접이식 책상', '소설책 세 권']) {
      await user.click(screen.getByRole('checkbox', { name: title }))
    }
    const summary = within(screen.getByRole('region', { name: '예약 요약' }))
    expect(summary.getByText('접이식 책상, 작은 화분')).toBeVisible()
    expect(summary.getByText('상품 금액 12,000원')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '선택 상품 예약하기' }))
    expect(reserve).toHaveBeenCalledWith({ productIds: ['desk', 'plant'], totalPrice: 12000 })
  })

  it('요청 중 필터·상품·버튼을 잠그고 중복 요청하지 않는다', async () => {
    let complete = () => {}
    const reserve = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          complete = resolve
        }),
    )
    const user = userEvent.setup()
    render(<ProductReservation reserveProducts={reserve} />)
    await user.click(screen.getByRole('checkbox', { name: '접이식 책상' }))
    await user.click(screen.getByRole('button', { name: '선택 상품 예약하기' }))
    expect(screen.getByRole('button', { name: '예약 중' })).toBeDisabled()
    for (const input of [...screen.getAllByRole('radio'), ...screen.getAllByRole('checkbox')]) expect(input).toBeDisabled()
    await user.click(screen.getByRole('button', { name: '예약 중' }))
    expect(reserve).toHaveBeenCalledTimes(1)
    await act(async () => complete())
    expect(await screen.findByText('선택한 상품을 예약했어요.')).toBeVisible()
  })

  it('실패하면 선택·필터를 보존하고 같은 데이터로 재시도하며 성공하면 선택만 비운다', async () => {
    const reserve = vi.fn().mockRejectedValueOnce(new Error('실패')).mockResolvedValueOnce(undefined)
    const user = userEvent.setup()
    render(<ProductReservation reserveProducts={reserve} />)
    await user.click(screen.getByRole('checkbox', { name: '접이식 책상' }))
    await user.click(screen.getByRole('radio', { name: '나눔' }))
    await user.click(screen.getByRole('button', { name: '선택 상품 예약하기' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('다시 시도해 주세요.')
    expect(screen.getByText('선택 1개')).toBeVisible()
    expect(screen.getByRole('radio', { name: '나눔' })).toBeChecked()
    await user.click(screen.getByRole('button', { name: '선택 상품 예약하기' }))
    expect(reserve.mock.calls).toEqual([[{ productIds: ['desk'], totalPrice: 12000 }], [{ productIds: ['desk'], totalPrice: 12000 }]])
    expect(await screen.findByRole('status')).toHaveTextContent('선택한 상품을 예약했어요.')
    expect(screen.getByText('선택 0개')).toBeVisible()
    expect(screen.getByRole('radio', { name: '나눔' })).toBeChecked()
    await user.click(screen.getByRole('radio', { name: '전체' }))
    for (const input of screen.getAllByRole('checkbox')) expect(input).not.toBeChecked()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('오류 안내는 새 선택을 하면 제거한다', async () => {
    const user = userEvent.setup()
    render(<ProductReservation reserveProducts={vi.fn().mockRejectedValue(new Error('실패'))} />)
    await user.click(screen.getByRole('checkbox', { name: '접이식 책상' }))
    await user.click(screen.getByRole('button', { name: '선택 상품 예약하기' }))
    expect(await screen.findByRole('alert')).toBeVisible()
    await user.click(screen.getByRole('checkbox', { name: '접이식 책상' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '선택 상품 예약하기' })).toBeDisabled()
  })
})

it('모의 API는 첫 예약에만 실패하고 다음 예약은 성공한다', async () => {
  vi.useFakeTimers()
  const reserve = createDemoReservation()
  const first = expect(reserve({ productIds: ['plant'], totalPrice: 0 })).rejects.toThrow('일시적인 연결 실패')
  await vi.advanceTimersByTimeAsync(800)
  await first
  const second = expect(reserve({ productIds: ['plant'], totalPrice: 0 })).resolves.toBeUndefined()
  await vi.advanceTimersByTimeAsync(800)
  await second
})
