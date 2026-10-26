import { ExpenseSplitView } from '../split/ExpenseSplitView'
import { splitStarter } from '../split/preview'
import type { SplitApi } from '../split/types'
export function ExpenseSplitPage({ api }: { api: SplitApi }) {
  // TODO: 조회·입력·검증·분배 계산·결과 무효화·저장을 직접 구현하세요.
  // 제공 화면 props를 전부 state로 저장할 필요는 없습니다.
  void api
  return <ExpenseSplitView {...splitStarter} />
}
