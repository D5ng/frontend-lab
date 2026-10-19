import { initialProducts } from './api'
import { RemovalView, type RemovalViewProps } from './view'

// 고정 props 표현 검수용. 전이·API·실습 정답 로직이 아닙니다.
export function RemovalPreview({ scene }: { scene: string }) {
  const [chair] = initialProducts
  const props: RemovalViewProps = {
    items: initialProducts,
    undoItem: null,
    removingId: null,
    restoring: false,
    message: '',
    error: '',
    onRemove: () => {},
    onUndo: () => {},
  }
  if (scene === 'pending') props.removingId = 'chair'
  if (['removed', 'restorePending', 'error', 'empty'].includes(scene)) {
    props.items = initialProducts.slice(1)
    props.undoItem = chair
    props.message = '원목 의자를 목록에서 뺐어요.'
  }
  if (scene === 'restorePending') {
    props.restoring = true
    props.message = ''
  }
  if (scene === 'error') {
    props.error = '되돌리지 못했어요. 다시 시도해 주세요.'
    props.message = ''
  }
  if (scene === 'empty') {
    props.items = []
    props.undoItem = initialProducts[2]
    props.message = '작은 책장을 목록에서 뺐어요.'
  }
  if (scene === 'restored') props.message = '원목 의자를 다시 담았어요.'
  return <RemovalView {...props} />
}
