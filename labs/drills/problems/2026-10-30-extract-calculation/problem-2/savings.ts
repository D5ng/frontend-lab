import type { SavingsProduct, SavingsTerm } from './api'

export const INTEREST_TAX_PERCENT = 15.4

export const AUTO_TRANSFER_RATE = 0.5

export const DEFAULT_SAVINGS_MONTHS = 12

export function getInitialMonths(terms: SavingsTerm[]) {
  return terms.some((term) => term.months === DEFAULT_SAVINGS_MONTHS) ? DEFAULT_SAVINGS_MONTHS : terms[0].months
}

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

export function calculateAppliedRate(rate: number, isAutoTransfer: boolean) {
  if (!isAutoTransfer) {
    return rate
  }

  return rate + AUTO_TRANSFER_RATE
}
