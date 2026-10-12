import { examplePosts } from './api'
import type { FeedViewProps } from './view'

const initial: FeedViewProps = {
  neighborhood: 'seongsu',
  posts: [],
  busy: false,
  loaded: false,
  onNeighborhoodChange: () => {},
  onReload: () => {},
}
// 정적 표현 검수용 값입니다. 요청이나 상태 전이를 구현하지 않습니다.
export const previews: Record<string, FeedViewProps> = {
  initial,
  loading: { ...initial, busy: true },
  error: { ...initial, neighborhood: 'yeonnam', error: '게시글을 불러오지 못했어요. 다시 불러오거나 다른 동네를 골라 주세요.' },
  empty: { ...initial, neighborhood: 'mangwon', loaded: true },
  success: { ...initial, posts: examplePosts, loaded: true },
}
