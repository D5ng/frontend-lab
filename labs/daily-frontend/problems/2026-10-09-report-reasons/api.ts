import { createApiClient } from '../../src/api/client'

export type Reason = 'no-show' | 'wrong-item' | 'other'
export type ReportRequest = { reason: 'no-show' } | { reason: 'wrong-item' | 'other'; description: string }
export type SendReport = (request: ReportRequest) => Promise<void>

// HTTP 응답 모킹은 handlers.ts에 두고 기존 함수 주입 계약을 유지한다.
export function createReportMock(): SendReport {
  const request = createApiClient()
  return (report) => request('/api/daily/2026-10-09-report-reasons/reports', { method: 'POST', body: JSON.stringify(report) })
}
