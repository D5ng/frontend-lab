import type { FeedViewProps } from './FeedView'
import { demoPages } from '../apis/demoPages'

export const previews: Record<string, FeedViewProps> = {
  initial: {
    items: [],
    loading: false,
    loadingMore: false,
    ready: false,
    hasMore: false,
    error: null,
    canLoadMore: false,
    onRefresh: () => {},
    onLoadMore: () => {},
  },
}
previews.loading = { ...previews.initial, loading: true }
previews.ready = { ...previews.initial, items: demoPages.start.items, ready: true, hasMore: true, canLoadMore: true }
previews.more = { ...previews.ready, loadingMore: true, canLoadMore: false }
previews.error = { ...previews.initial, error: 'initial' }
previews.moreError = { ...previews.ready, error: 'more' }
previews.empty = { ...previews.initial, ready: true }
previews.complete = { ...previews.ready, hasMore: false, canLoadMore: false }
