import type { createApiClient } from '../../../../../src/api/client'
import type { ExportInput, ExportReceipt } from '../types/exportRequest'

export function requestExport(request: ReturnType<typeof createApiClient>, input: ExportInput) {
  return request<ExportReceipt>('/api/daily/2026-10-22/exports', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
