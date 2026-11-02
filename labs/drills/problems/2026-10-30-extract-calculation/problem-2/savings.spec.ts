import { describe, expect, it } from 'vitest'
import { calculateTermMaturity, getInitialMonths } from './savings'

describe('calculateTermMaturity', () => {
  const term = { months: 12, annualRate: 3.5 }

  it('매달 300,000원, 12개월, 연 3.5%면 만기에 3,657,740원을 받는다', () => {
    const result = calculateTermMaturity(300_000, term, false)
    expect(result.appliedRate).toBe(3.5)
    expect(result.interest).toBe(68_250)
    expect(result.tax).toBe(10_510)
    expect(result.maturityAmount).toBe(3_657_740)
  })

  it('자동이체로 넣으면 우대 금리를 더한 연 4.0%로 계산해 만기에 3,665,988원을 받는다', () => {
    const result = calculateTermMaturity(300_000, term, true)
    expect(result.appliedRate).toBe(4.0)
    expect(result.interest).toBe(78_000)
    expect(result.tax).toBe(12_012)
    expect(result.maturityAmount).toBe(3_665_988)
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
