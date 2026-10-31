import type { SavingsProduct } from './api'

export const INTEREST_TAX_PERCENT = 15.4

export function isMonthlyAmountInRange(monthlyAmount: number, product: SavingsProduct): boolean {
  return product.minMonthlyAmount <= monthlyAmount && monthlyAmount <= product.maxMonthlyAmount
}

export function calculateSavingsMaturity(monthlyAmount: number, months: number, annualRate: number) {
  const principal = monthlyAmount * months
  const interest = Math.floor(monthlyAmount * (annualRate / 100 / 12) * ((months * (months + 1)) / 2))
  const tax = Math.floor(interest * (INTEREST_TAX_PERCENT / 100))
  const afterTaxInterest = interest - tax
  const maturityAmount = principal + interest - tax

  return {
    principal,
    interest,
    tax,
    afterTaxInterest,
    maturityAmount,
  }
}
