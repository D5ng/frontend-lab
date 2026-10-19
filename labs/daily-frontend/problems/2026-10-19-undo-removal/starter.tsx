import { initialProducts, type RemovalApi } from './api'
import { RemovalView } from './view'

export function ProductRemoval({ api }: { api: RemovalApi }) {
  // TODO: 삭제·되돌리기·실패·중복 조작을 직접 구현하세요. API는 아직 호출하지 않습니다.
  void api
  return (
    <RemovalView
      items={initialProducts}
      undoItem={null}
      removingId={null}
      restoring={false}
      message=""
      error=""
      onRemove={() => {}}
      onUndo={() => {}}
    />
  )
}
