import { createApiClient } from '../../../../../src/api/client'
import type { SendReport } from '../types/report'

// HTTP 응답 모킹은 handlers.ts에 두고 기존 함수 주입 계약을 유지한다.
export function createReportMock(): SendReport {
  const request = createApiClient()
  return (report) => request('/api/daily/2026-10-09-report-reasons/reports', { method: 'POST', body: JSON.stringify(report) })
}
