export type Memo = { memo: string }

export type SaveMemo = (request: Memo) => Promise<Memo>
