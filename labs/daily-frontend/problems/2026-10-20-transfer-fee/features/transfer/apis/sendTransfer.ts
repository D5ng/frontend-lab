import type { createApiClient } from '../../../../../src/api/client'
import type { TransferInput, TransferReceipt } from '../types/transfer'

export function sendTransfer(request: ReturnType<typeof createApiClient>, input: TransferInput) {
  return request<TransferReceipt>('/api/daily/2026-10-20/transfers', { method: 'POST', body: JSON.stringify(input) })
}
