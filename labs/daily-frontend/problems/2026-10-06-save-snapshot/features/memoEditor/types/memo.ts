export type Memo = { memo: string }

export type SaveMemo = (request: Memo) => Promise<Memo>

export interface NoticeResult {
  tone: 'critical' | 'positive'
  role: 'alert' | 'status'
  message: string
}

export type SaveResult = 'success' | 'error'
