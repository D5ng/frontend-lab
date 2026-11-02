import { describe, expect, it } from 'vitest'
import { calculateSavingsMaturity } from './savings'

describe('calculateSavingsMaturity', () => {
  it('매달 300,000원, 12개월, 연 3.5%면 만기에 3,657,740원을 받는다', () => {
    const result = calculateSavingsMaturity(300_000, 12, 3.5)
    expect(result.interest).toBe(68_250)
    expect(result.tax).toBe(10_510)
    expect(result.maturityAmount).toBe(3_657_740)
  })
})
