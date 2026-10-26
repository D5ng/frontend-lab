import type { createApiClient } from '../../../../../src/api/client'

export function endSession(request: ReturnType<typeof createApiClient>, id: string) {
  return request<void>(`/api/daily/2026-10-26/sessions/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
