import { describe, expect, it } from 'vitest'
import type { SavingsProduct } from './api'
import { calculateSavingsMaturity, getAmountInputStatus, getInitialMonths } from './savings'

describe('calculateSavingsMaturity', () => {
  it('매달 300,000원, 12개월, 연 3.5%면 만기에 3,657,740원을 받는다', () => {
    const result = calculateSavingsMaturity(300_000, 12, 3.5)
    expect(result.interest).toBe(68_250)
    expect(result.tax).toBe(10_510)
    expect(result.maturityAmount).toBe(3_657_740)
  })
})

describe('getInitialMonths', () => {
  it('상품에 12개월이 있으면 12개월을 고른다', () => {
    const terms = [
      { months: 6, annualRate: 3.0 },
      { months: 12, annualRate: 3.5 },
      { months: 24, annualRate: 4.0 },
    ]
    expect(getInitialMonths(terms)).toBe(12)
  })

  it('상품에 12개월이 없으면 첫 번째 기간을 고른다', () => {
    const terms = [
      { months: 6, annualRate: 3.0 },
      { months: 24, annualRate: 4.0 },
    ]
    expect(getInitialMonths(terms)).toBe(6)
  })
})

describe('getAmountInputStatus', () => {
  const product: SavingsProduct = {
    id: 'monthly-1',
    name: '매달 모으는 적금',
    minMonthlyAmount: 10_000,
    maxMonthlyAmount: 500_000,
    terms: [{ months: 12, annualRate: 3.5 }],
  }

  it('아무것도 입력하지 않으면 아직 안 쓴 상태다', () => {
    expect(getAmountInputStatus('', product)).toBe('empty')
  })

  it('최소 금액보다 적으면 범위 밖이다', () => {
    expect(getAmountInputStatus('9999', product)).toBe('outOfRange')
  })

  it('최대 금액보다 많으면 범위 밖이다', () => {
    expect(getAmountInputStatus('500001', product)).toBe('outOfRange')
  })

  it('최소 금액과 최대 금액은 범위 안에 들어간다', () => {
    expect(getAmountInputStatus('10000', product)).toBe('valid')
    expect(getAmountInputStatus('500000', product)).toBe('valid')
  })
})
