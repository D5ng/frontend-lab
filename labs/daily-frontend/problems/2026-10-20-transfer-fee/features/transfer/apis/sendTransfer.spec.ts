import { describe, expect, it } from 'vitest'
import { createApiClient } from '../../../../../src/api/client'
import { sendTransfer } from './sendTransfer'

const input = { accountId: 'living', bank: 'other' as const, amount: 1000, fee: 500, totalDebit: 1500 }
describe('송금 HTTP 계약', () => {
  it('첫 실패 후 같은 세션의 요청 본문을 신청 결과로 받는다', async () => {
    const request = createApiClient()
    await expect(sendTransfer(request, input)).rejects.toThrow('연습용 첫 요청 실패')
    await expect(sendTransfer(request, input)).resolves.toEqual({ ...input, id: 'transfer-2' })
  })
  it('새 세션은 이전 실패 횟수를 공유하지 않는다', async () => {
    await expect(sendTransfer(createApiClient(), input)).rejects.toThrow()
    await expect(sendTransfer(createApiClient(), input)).rejects.toThrow()
  })
})
