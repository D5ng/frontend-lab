import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Problem } from './Problem'

describe('상품 수령 방법', () => {
  it('처음에는 배달 주소 입력만 보여준다', () => {
    render(<Problem />)

    expect(screen.getByRole('radio', { name: '배달' })).toBeChecked()
    expect(screen.getByRole('textbox', { name: '배달 주소' })).toBeVisible()
    expect(screen.queryByRole('textbox', { name: '픽업 매장' })).not.toBeInTheDocument()
  })

  it('배달 주소 없이 요청하면 입력 안내를 보여준다', async () => {
    const user = userEvent.setup()
    render(<Problem />)

    await user.click(screen.getByRole('button', { name: '요청하기' }))

    expect(screen.getByText('배달 주소를 입력해 주세요.')).toBeVisible()
  })

  it('픽업을 선택하면 픽업 매장 입력으로 전환한다', async () => {
    const user = userEvent.setup()
    render(<Problem />)

    await user.click(screen.getByRole('radio', { name: '매장 픽업' }))

    expect(screen.getByRole('textbox', { name: '픽업 매장' })).toBeVisible()
    expect(screen.queryByRole('textbox', { name: '배달 주소' })).not.toBeInTheDocument()
  })

  it.each([
    {
      method: '배달',
      field: '배달 주소',
      value: '서울시 강남구 테헤란로 1',
      expected: '서울시 강남구 테헤란로 1 주소로 배달을 요청했어요.',
    },
    {
      method: '매장 픽업',
      field: '픽업 매장',
      value: '역삼점',
      expected: '역삼점 매장에서 픽업을 요청했어요.',
    },
  ])('$method 요청 결과를 사용자에게 알려준다', async (scenario) => {
    const user = userEvent.setup()
    render(<Problem />)

    await user.click(screen.getByRole('radio', { name: scenario.method }))
    await user.type(screen.getByRole('textbox', { name: scenario.field }), scenario.value)
    await user.click(screen.getByRole('button', { name: '요청하기' }))

    expect(screen.getByText(scenario.expected)).toBeVisible()
  })

  it('수령 방법을 다시 선택해도 이전에 입력한 배달 주소를 유지한다', async () => {
    const user = userEvent.setup()
    render(<Problem />)

    await user.type(screen.getByRole('textbox', { name: '배달 주소' }), '서울시 강남구 테헤란로 1')

    await user.click(screen.getByRole('radio', { name: '매장 픽업' }))
    await user.click(screen.getByRole('radio', { name: '배달' }))

    expect(screen.getByRole('textbox', { name: '배달 주소' })).toHaveValue('서울시 강남구 테헤란로 1')
  })
})
