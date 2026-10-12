import type { LoadPosts } from './api'
import { FeedView } from './view'

export function NeighborhoodFeed({ loadPosts }: { loadPosts: LoadPosts }) {
  // TODO: 첫 요청, 선택 변경, 재시도와 결과 반영을 직접 구현하세요.
  // 표현용 props 하나마다 반드시 상태 하나가 필요한 것은 아닙니다.
  void loadPosts
  return <FeedView neighborhood="seongsu" posts={[]} busy={false} loaded={false} onNeighborhoodChange={() => {}} onReload={() => {}} />
}
