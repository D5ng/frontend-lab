import { useState } from 'react'
import { parseAmountInput } from '../amountInput'
import type { SavingsProduct } from '../api'

export function useAmountInput(product: SavingsProduct) {
  const [amountText, setAmountText] = useState('')

  const { monthlyAmount, amountStatus } = parseAmountInput(amountText, product)

  const handleAmountChange = (value: string) => {
    setAmountText(value.replace(/\D/g, ''))
  }

  return {
    amountText,
    monthlyAmount,
    amountStatus,
    handleAmountChange,
  }
}
