import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Problem } from './Problem'

afterEach(cleanup)

async function choose(user: ReturnType<typeof userEvent.setup>, name: string, value: string) {
  const label =
    name === '수량'
      ? `${value}개`
      : ({ '': '매장을 선택해 주세요', gangnam: '강남점', seongsu: '성수점', today: '오늘', tomorrow: '내일' } as Record<string, string>)[
          value
        ]
  await user.click(screen.getByRole('combobox', { name }))
  await user.click(await screen.findByRole('option', { name: label }))
}

function getAmount(label: string) {
  const term = screen.getByText(label, { selector: 'dt' })
  return term.nextElementSibling?.textContent
}

describe('배송·픽업 주문의 기존 행동', () => {
  it('배송 기본값과 금액을 표시하고 최소 금액을 주소보다 먼저 검사한다', async () => {
    const user = userEvent.setup()
    const sendOrder = vi.fn().mockResolvedValue(undefined)
    render(<Problem sendOrder={sendOrder} />)
    expect(screen.getByRole('radio', { name: '배송' })).toBeChecked()
    expect(getAmount('상품 금액')).toBe('6,000원')
    expect(getAmount('배송비')).toBe('3,000원')
    expect(getAmount('결제 예정 금액')).toBe('9,000원')
    await user.click(screen.getByRole('button', { name: '배송 주문하기' }))
    expect(screen.getByRole('status')).toHaveTextContent('배송 주문은 상품 금액 10,000원부터 가능해요.')
    expect(sendOrder).not.toHaveBeenCalled()
    await choose(user, '수량', '2')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    await user.type(screen.getByRole('textbox', { name: '배송 주소' }), '   ')
    await user.click(screen.getByRole('button', { name: '배송 주문하기' }))
    expect(screen.getByRole('status')).toHaveTextContent('배송 주소를 입력해 주세요.')
    expect(sendOrder).not.toHaveBeenCalled()
  })

  it.each([
    [2, 3000, 15000],
    [4, 3000, 27000],
    [5, 0, 30000],
  ])('배송 %i개의 화면 금액과 요청 금액이 일치하고 주소 공백을 제거한다', async (quantity, shippingFee, totalPrice) => {
    const user = userEvent.setup()
    const sendOrder = vi.fn().mockResolvedValue(undefined)
    render(<Problem sendOrder={sendOrder} />)
    await choose(user, '수량', String(quantity))
    await user.type(screen.getByRole('textbox', { name: '배송 주소' }), '  서울시 강남구  ')
    expect(getAmount('배송비')).toBe(`${shippingFee.toLocaleString('ko-KR')}원`)
    expect(getAmount('결제 예정 금액')).toBe(`${totalPrice.toLocaleString('ko-KR')}원`)
    await user.click(screen.getByRole('button', { name: '배송 주문하기' }))
    expect(sendOrder).toHaveBeenCalledExactlyOnceWith({ type: 'delivery', quantity, address: '서울시 강남구', shippingFee, totalPrice })
    expect(screen.getByRole('status')).toHaveTextContent('배송 주문을 완료했어요.')
    expect(screen.getByRole('textbox', { name: '배송 주소' })).toHaveValue('  서울시 강남구  ')
  })

  it('픽업 1개는 최소 금액과 배송비 없이 예약하고 배송 필드를 요청하지 않는다', async () => {
    const user = userEvent.setup()
    const sendOrder = vi.fn().mockResolvedValue(undefined)
    render(<Problem sendOrder={sendOrder} />)
    await user.click(screen.getByRole('radio', { name: '매장 픽업' }))
    expect(screen.queryByRole('textbox', { name: '배송 주소' })).not.toBeInTheDocument()
    expect(getAmount('배송비')).toBe('0원')
    expect(getAmount('결제 예정 금액')).toBe('6,000원')
    await user.click(screen.getByRole('button', { name: '픽업 예약하기' }))
    expect(screen.getByRole('status')).toHaveTextContent('픽업 매장을 선택해 주세요.')
    expect(sendOrder).not.toHaveBeenCalled()
    await choose(user, '픽업 매장', 'gangnam')
    await user.click(screen.getByRole('button', { name: '픽업 예약하기' }))
    expect(sendOrder).toHaveBeenCalledExactlyOnceWith({
      type: 'pickup',
      quantity: 1,
      store: 'gangnam',
      pickupDate: 'today',
      totalPrice: 6000,
    })
    expect(screen.getByRole('status')).toHaveTextContent('픽업 예약을 완료했어요.')
    await choose(user, '픽업 매장', '')
    await user.click(screen.getByRole('button', { name: '픽업 예약하기' }))
    expect(screen.getByRole('status')).toHaveTextContent('픽업 매장을 선택해 주세요.')
    expect(sendOrder).toHaveBeenCalledTimes(1)
  })

  it('픽업 매장을 먼저 검사하고 오늘은 4개를 거절하지만 내일은 5개를 허용한다', async () => {
    const user = userEvent.setup()
    const sendOrder = vi.fn().mockResolvedValue(undefined)
    render(<Problem sendOrder={sendOrder} />)
    await user.click(screen.getByRole('radio', { name: '매장 픽업' }))
    await choose(user, '수량', '4')
    await user.click(screen.getByRole('button', { name: '픽업 예약하기' }))
    expect(screen.getByRole('status')).toHaveTextContent('픽업 매장을 선택해 주세요.')
    await choose(user, '픽업 매장', 'seongsu')
    await user.click(screen.getByRole('button', { name: '픽업 예약하기' }))
    expect(screen.getByRole('status')).toHaveTextContent('오늘 픽업은 3개까지 가능해요. 내일을 선택해 주세요.')
    expect(sendOrder).not.toHaveBeenCalled()
    await choose(user, '수량', '5')
    await choose(user, '픽업 날짜', 'tomorrow')
    await user.click(screen.getByRole('button', { name: '픽업 예약하기' }))
    expect(sendOrder).toHaveBeenCalledExactlyOnceWith({
      type: 'pickup',
      quantity: 5,
      store: 'seongsu',
      pickupDate: 'tomorrow',
      totalPrice: 30000,
    })
  })

  it('오늘 픽업은 경계값 3개를 허용한다', async () => {
    const user = userEvent.setup()
    const sendOrder = vi.fn().mockResolvedValue(undefined)
    render(<Problem sendOrder={sendOrder} />)
    await user.click(screen.getByRole('radio', { name: '매장 픽업' }))
    await choose(user, '픽업 매장', 'gangnam')
    await choose(user, '수량', '3')
    await user.click(screen.getByRole('button', { name: '픽업 예약하기' }))
    expect(sendOrder).toHaveBeenCalledExactlyOnceWith({
      type: 'pickup',
      quantity: 3,
      store: 'gangnam',
      pickupDate: 'today',
      totalPrice: 18000,
    })
  })

  it('받는 방법을 바꿔도 숨은 입력과 수량을 유지한다', async () => {
    const user = userEvent.setup()
    render(<Problem />)
    await user.type(screen.getByRole('textbox', { name: '배송 주소' }), '서울')
    await choose(user, '수량', '3')
    await user.click(screen.getByRole('radio', { name: '매장 픽업' }))
    await choose(user, '픽업 매장', 'seongsu')
    await choose(user, '픽업 날짜', 'tomorrow')
    await user.click(screen.getByRole('radio', { name: '배송' }))
    expect(screen.getByRole('textbox', { name: '배송 주소' })).toHaveValue('서울')
    expect(screen.getByRole('combobox', { name: '수량' })).toHaveTextContent('3개')
    await user.click(screen.getByRole('radio', { name: '매장 픽업' }))
    expect(screen.getByRole('combobox', { name: '픽업 매장' })).toHaveTextContent('성수점')
    expect(screen.getByRole('combobox', { name: '픽업 날짜' })).toHaveTextContent('내일')
  })

  it.each(['delivery', 'pickup'] as const)('%s 요청 중 모든 조작을 잠그고 실패 후 같은 입력으로 재시도한다', async (type) => {
    const user = userEvent.setup()
    let rejectRequest!: (error: Error) => void
    const pending = new Promise<void>((_resolve, reject) => {
      rejectRequest = reject
    })
    const sendOrder = vi.fn().mockReturnValueOnce(pending).mockResolvedValue(undefined)
    render(<Problem sendOrder={sendOrder} />)
    if (type === 'delivery') {
      await choose(user, '수량', '2')
      await user.type(screen.getByRole('textbox', { name: '배송 주소' }), '서울')
    } else {
      await user.click(screen.getByRole('radio', { name: '매장 픽업' }))
      await choose(user, '픽업 매장', 'gangnam')
    }
    const buttonName = type === 'delivery' ? '배송 주문하기' : '픽업 예약하기'
    await user.click(screen.getByRole('button', { name: buttonName }))
    const form = screen.getByRole('region', { name: '커피 주문' })
    for (const control of within(form).getAllByRole('radio')) expect(control).toBeDisabled()
    for (const control of within(form).getAllByRole('combobox')) expect(control).toBeDisabled()
    if (type === 'delivery') expect(screen.getByRole('textbox', { name: '배송 주소' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '처리 중...' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: '처리 중...' }))
    expect(sendOrder).toHaveBeenCalledTimes(1)
    await act(async () => {
      rejectRequest(new Error('offline'))
    })
    expect(screen.getByRole('status')).toHaveTextContent(
      type === 'delivery' ? '배송 주문을 완료하지 못했어요. 다시 시도해 주세요.' : '픽업 예약을 완료하지 못했어요. 다시 시도해 주세요.',
    )
    expect(screen.getByRole('button', { name: buttonName })).toBeEnabled()
    for (const control of within(form).getAllByRole('combobox')) expect(control).toBeEnabled()
    await user.click(screen.getByRole('button', { name: buttonName }))
    expect(sendOrder).toHaveBeenCalledTimes(2)
    expect(sendOrder.mock.calls[1][0]).toEqual(sendOrder.mock.calls[0][0])
    expect(screen.getByRole('status')).toHaveTextContent(type === 'delivery' ? '배송 주문을 완료했어요.' : '픽업 예약을 완료했어요.')
    await choose(user, '수량', '3')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })
})
