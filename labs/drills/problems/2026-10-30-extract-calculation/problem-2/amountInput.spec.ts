import { describe, expect, it } from 'vitest'
import { parseAmountInput } from './amountInput'
import type { SavingsProduct } from './api'

describe('parseAmountInput', () => {
  const product: SavingsProduct = {
    id: 'monthly-1',
    name: '매달 모으는 적금',
    minMonthlyAmount: 10_000,
    maxMonthlyAmount: 500_000,
    terms: [{ months: 12, annualRate: 3.5 }],
  }

  it('아무것도 입력하지 않으면 아직 안 쓴 상태다', () => {
    expect(parseAmountInput('', product).amountStatus).toBe('empty')
  })

  it('0을 입력하면 아직 안 쓴 게 아니라 범위 밖이다', () => {
    expect(parseAmountInput('0', product).amountStatus).toBe('outOfRange')
  })

  it('최소 금액보다 적으면 범위 밖이다', () => {
    expect(parseAmountInput('9999', product).amountStatus).toBe('outOfRange')
  })

  it('최대 금액보다 많으면 범위 밖이다', () => {
    expect(parseAmountInput('500001', product).amountStatus).toBe('outOfRange')
  })

  it('최소 금액과 최대 금액은 범위 안에 들어간다', () => {
    expect(parseAmountInput('10000', product).amountStatus).toBe('valid')
    expect(parseAmountInput('500000', product).amountStatus).toBe('valid')
  })

  it('입력한 글자를 매달 넣는 돈으로 바꿔 준다', () => {
    expect(parseAmountInput('300000', product)).toEqual({ monthlyAmount: 300_000, amountStatus: 'valid' })
  })
})
