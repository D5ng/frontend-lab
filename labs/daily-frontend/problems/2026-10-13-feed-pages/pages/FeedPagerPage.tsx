import type { LoadPage } from '../features/feedPager/types/feed'
import { FeedView } from '../features/feedPager/components/FeedView'

export function FeedPagerPage({ loadPage }: { loadPage: LoadPage }) {
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
