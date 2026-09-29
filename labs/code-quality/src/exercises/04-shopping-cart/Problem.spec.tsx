import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Problem } from './Problem'

function getQuantity(productName: string) {
  return screen.getByRole('status', { name: `${productName} 수량` })
}

function getIncreaseButton(productName: string) {
  return screen.getByRole('button', { name: `${productName} 수량 늘리기` })
}

function getDecreaseButton(productName: string) {
  return screen.getByRole('button', { name: `${productName} 수량 줄이기` })
}

function getTotal() {
  return within(screen.getByRole('region', { name: '총 결제 금액' }))
}

describe('장바구니 2단계: 여러 상품', () => {
  it('담긴 상품마다 수량을 보여주고 모두 합한 금액을 보여준다', () => {
    render(<Problem />)

    expect(getQuantity('제주 햇감귤 3kg')).toHaveTextContent('1')
    expect(getQuantity('유기농 바나나 1.2kg')).toHaveTextContent('2')
    expect(getQuantity('무항생제 유정란 30구')).toHaveTextContent('1')
    expect(getTotal().getByText('40,500원')).toBeVisible()
  })

  it('한 상품의 수량을 늘리면 그 상품만 바뀌고 총 결제 금액에 반영된다', async () => {
    const user = userEvent.setup()
    render(<Problem />)

    await user.click(getIncreaseButton('유기농 바나나 1.2kg'))

    expect(getQuantity('유기농 바나나 1.2kg')).toHaveTextContent('3')
    expect(getQuantity('제주 햇감귤 3kg')).toHaveTextContent('1')
    expect(getQuantity('무항생제 유정란 30구')).toHaveTextContent('1')
    expect(getTotal().getByText('46,400원')).toBeVisible()
  })

  it('한 상품의 수량을 줄이면 그 상품만 바뀌고 총 결제 금액에 반영된다', async () => {
    const user = userEvent.setup()
    render(<Problem />)

    await user.click(getIncreaseButton('제주 햇감귤 3kg'))
    await user.click(getIncreaseButton('제주 햇감귤 3kg'))
    await user.click(getDecreaseButton('제주 햇감귤 3kg'))

    expect(getQuantity('제주 햇감귤 3kg')).toHaveTextContent('2')
    expect(getQuantity('유기농 바나나 1.2kg')).toHaveTextContent('2')
    expect(getTotal().getByText('59,400원')).toBeVisible()
  })

  it('상품마다 수량은 1개보다 줄일 수 없다', async () => {
    const user = userEvent.setup()
    render(<Problem />)

    expect(getDecreaseButton('제주 햇감귤 3kg')).toBeDisabled()
    expect(getDecreaseButton('유기농 바나나 1.2kg')).toBeEnabled()

    await user.click(getDecreaseButton('유기농 바나나 1.2kg'))

    expect(getQuantity('유기농 바나나 1.2kg')).toHaveTextContent('1')
    expect(getDecreaseButton('유기농 바나나 1.2kg')).toBeDisabled()
    expect(getTotal().getByText('34,600원')).toBeVisible()
  })
})
