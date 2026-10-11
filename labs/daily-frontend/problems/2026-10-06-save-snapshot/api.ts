import { createApiClient } from '../../src/api/client'

export const INITIAL_MEMO = '저녁 7시에 정문에서 만나기'

export type Memo = { memo: string }
export type SaveMemo = (request: Memo) => Promise<Memo>

// HTTP 응답 모킹은 handlers.ts에 두고 기존 함수 주입 계약을 유지한다.
export function createDemoSaver(): SaveMemo {
  const request = createApiClient()
  return (memo) => request<Memo>('/api/daily/2026-10-06-save-snapshot/memo', { method: 'PUT', body: JSON.stringify(memo) })
}
