import { useState } from 'react'
import { createApiClient } from '../../src/api/client'
import { sendTransfer } from './features/transfer/apis/sendTransfer'
import { TransferPage } from './pages/TransferPage'

export function Problem() {
  const [transfer] = useState(() => {
    const request = createApiClient()
    return (input: Parameters<typeof sendTransfer>[1]) => sendTransfer(request, input)
  })
  return <TransferPage sendTransfer={transfer} />
}
