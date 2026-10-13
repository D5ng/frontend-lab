import type { LoadPage } from './api'
import { FeedView } from './view'

export function FeedPager({ loadPage }: { loadPage: LoadPage }) {
  // TODO: 초기 조회·더보기·새로고침의 상태와 로직을 직접 구현하세요.
  void loadPage
  return (
    <FeedView
      items={[]}
      loading={false}
      loadingMore={false}
      ready={false}
      hasMore={false}
      error={null}
      canLoadMore={false}
      onRefresh={() => {}}
      onLoadMore={() => {}}
    />
  )
}
