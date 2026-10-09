export type Reason = 'no-show' | 'wrong-item' | 'other'
export type ReportRequest = { reason: 'no-show' } | { reason: 'wrong-item' | 'other'; description: string }
export type SendReport = (request: ReportRequest) => Promise<void>

export function createReportMock(): SendReport {
  let attempts = 0
  return () => {
    attempts += 1
    const fail = attempts === 1
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (fail) reject(new Error('접수 실패'))
        else resolve()
      }, 1800)
    })
  }
}
