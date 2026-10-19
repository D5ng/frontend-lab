import type { ShopApi } from '../features/shop/types/shop'
import { ShopView } from '../features/shop/components/ShopView'

export function ShopPage({ api }: { api: ShopApi }) {
  // TODO: 동시에 시작하는 두 조회와 영역별 성공·오류·재시도를 직접 구현하세요.
  // View props가 상태 설계의 정답은 아닙니다. 필요하면 계약도 바꿀 수 있습니다.
  void api
  return (
    <ShopView
      profile={null}
      profileBusy={false}
      profileError=""
      reviews={null}
      reviewsBusy={false}
      reviewsError=""
      onRetryProfile={() => {}}
      onRetryReviews={() => {}}
    />
  )
}
