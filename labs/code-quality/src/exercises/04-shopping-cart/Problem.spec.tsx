import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Problem } from './Problem'

function getTotal() {
  return within(screen.getByRole('region', { name: '총 결제 금액' }))
}

describe('장바구니 1단계: 수량 조절', () => {
  it('처음에는 상품 1개와 그 금액을 보여준다', () => {
    render(<Problem />)

    expect(screen.getByRole('status', { name: '수량' })).toHaveTextContent('1')
    expect(getTotal().getByText('18,900원')).toBeVisible()
  })

  it('수량을 늘리면 총 결제 금액이 함께 바뀐다', async () => {
    const user = userEvent.setup()
    render(<Problem />)

    await user.click(screen.getByRole('button', { name: '수량 늘리기' }))
    await user.click(screen.getByRole('button', { name: '수량 늘리기' }))

    expect(screen.getByRole('status', { name: '수량' })).toHaveTextContent('3')
    expect(getTotal().getByText('56,700원')).toBeVisible()
  })

  it('수량을 줄이면 총 결제 금액이 함께 바뀐다', async () => {
    const user = userEvent.setup()
    render(<Problem />)

    await user.click(screen.getByRole('button', { name: '수량 늘리기' }))
    await user.click(screen.getByRole('button', { name: '수량 줄이기' }))

    expect(screen.getByRole('status', { name: '수량' })).toHaveTextContent('1')
    expect(getTotal().getByText('18,900원')).toBeVisible()
  })

  it('수량은 1개보다 줄일 수 없다', async () => {
    const user = userEvent.setup()
    render(<Problem />)

    expect(screen.getByRole('button', { name: '수량 줄이기' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: '수량 늘리기' }))
    expect(screen.getByRole('button', { name: '수량 줄이기' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: '수량 줄이기' }))
    expect(screen.getByRole('button', { name: '수량 줄이기' })).toBeDisabled()
  })
})
