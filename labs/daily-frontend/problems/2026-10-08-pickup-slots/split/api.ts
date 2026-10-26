import { createApiClient } from '../../../src/api/client'
import type { SplitApi } from './types'
export function createSplitApi(): SplitApi {
  const request = createApiClient()
  const path = '/api/daily/2026-10-08-pickup-slots'
  return {
    getMembers: () => request(path + '/members'),
    save: (input) => request(path + '/splits', { method: 'POST', body: JSON.stringify(input) }),
  }
}
