import { createApiClient } from '../../../../../src/api/client'
import type { Page, LoadPage } from '../types/feed'

export function createPageLoader(): LoadPage {
  const request = createApiClient()
  return (cursor) =>
    request<Page>(`/api/daily/2026-10-13-feed-pages/posts${cursor === null ? '' : `?cursor=${encodeURIComponent(cursor)}`}`)
}
