export const INITIAL_MEMO = '저녁 7시에 정문에서 만나기'

export type Memo = { memo: string }
export type SaveMemo = (request: Memo) => Promise<Memo>

export function createDemoSaver(): SaveMemo {
  let attempts = 0
  return async (request) => {
    const snapshot = { memo: request.memo }
    attempts += 1
    const shouldFail = attempts === 1
    await new Promise<void>((resolve) => setTimeout(resolve, 1800))
    if (shouldFail) throw new Error('일시적인 연결 실패')
    return snapshot
  }
}
