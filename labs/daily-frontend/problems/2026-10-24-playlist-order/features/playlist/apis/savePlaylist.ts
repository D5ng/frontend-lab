import type { createApiClient } from '../../../../../src/api/client'
import type { PlaylistInput, PlaylistReceipt } from '../types/playlist'

export function savePlaylist(request: ReturnType<typeof createApiClient>, input: PlaylistInput) {
  return request<PlaylistReceipt>('/api/daily/2026-10-24/playlist', { method: 'PUT', body: JSON.stringify(input) })
}
