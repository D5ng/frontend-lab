export interface TransferInput {
  accountId: string
  bank: 'same' | 'other'
  amount: number
  fee: number
  totalDebit: number
}
export interface TransferReceipt extends TransferInput {
  id: string
}
export type SendTransfer = (input: TransferInput) => Promise<TransferReceipt>
