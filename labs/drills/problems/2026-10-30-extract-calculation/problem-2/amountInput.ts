import type { SavingsProduct } from './api'
import { isMonthlyAmountInRange } from './savings'

type AmountInputStatus = 'empty' | 'outOfRange' | 'valid'

export function parseAmountInput(amountText: string, product: SavingsProduct) {
  const monthlyAmount = Number(amountText)
  const amountStatus = getAmountInputStatus(amountText, monthlyAmount, product)

  return {
    monthlyAmount,
    amountStatus,
  }
}

function getAmountInputStatus(amountText: string, monthlyAmount: number, product: SavingsProduct): AmountInputStatus {
  if (amountText === '') {
    return 'empty'
  }

  return isMonthlyAmountInRange(monthlyAmount, product) ? 'valid' : 'outOfRange'
}
