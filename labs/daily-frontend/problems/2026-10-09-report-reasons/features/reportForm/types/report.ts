export type Reason = 'no-show' | 'wrong-item' | 'other'

export type ReportRequest = { reason: 'no-show' } | { reason: 'wrong-item' | 'other'; description: string }

export type SendReport = (request: ReportRequest) => Promise<void>
