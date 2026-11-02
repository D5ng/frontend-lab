import { useActions } from '@stackflow/react'
import { useState } from 'react'
import { openSavingsAccount } from '../api'

interface Params {
  productId: string
  monthlyAmount: number
  months: number
  autoTransfer: boolean
}

export function useOpenSavingsAccount({ productId, monthlyAmount, months, autoTransfer }: Params) {
  const { replace } = useActions()
  const [submitting, setSubmitting] = useState(false)
  const [failed, setFailed] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    setFailed(false)
    try {
      await openSavingsAccount({ productId: productId, monthlyAmount, months, autoTransfer })
      replace('SavingsDone', { monthlyAmount, months })
    } catch {
      setFailed(true)
      setSubmitting(false)
    }
  }

  return {
    submitting,
    failed,
    handleSubmit,
  }
}
