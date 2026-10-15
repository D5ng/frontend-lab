import type { LoadDetail } from './api'
import { DetailView } from './view'

export function ListingBrowser({ loadDetail }: { loadDetail: LoadDetail }) {
  // TODO: 최초 조회, 선택, 상품별 결과 재사용, 중복 요청 방지와 실패 후 재시도를 구현하세요.
  // View의 props 하나마다 상태 하나를 만들 필요는 없습니다. View 계약도 변경할 수 있습니다.
  void loadDetail
  return <DetailView selectedId="chair" detail={undefined} busy={false} error="" onSelect={() => {}} onRetry={() => {}} />
}
