import { INITIAL_MEMO } from './api'
import type { MemoViewProps } from './view'

// 검수용 고정 화면 데이터입니다. 사용자 이벤트나 저장 흐름을 구현하지 않습니다.
export const previews = {
  initial: { savedMemo: INITIAL_MEMO, inputMemo: INITIAL_MEMO, changed: false, busy: false },
  editing: { savedMemo: INITIAL_MEMO, inputMemo: '저녁 8시로 변경', changed: true, busy: false },
  empty: { savedMemo: INITIAL_MEMO, inputMemo: '', changed: true, busy: false },
  loading: { savedMemo: INITIAL_MEMO, inputMemo: '저녁 8시로 변경. 우산도 챙기기', changed: true, busy: true },
  error: {
    savedMemo: INITIAL_MEMO,
    inputMemo: '저녁 8시로 변경. 우산도 챙기기',
    changed: true,
    busy: false,
    failed: true,
    message: '저장하지 못했어요. 작성 중인 내용은 그대로예요. 다시 시도해 주세요.',
  },
  success: {
    savedMemo: '저녁 8시로 변경',
    inputMemo: '저녁 8시로 변경',
    changed: false,
    busy: false,
    message: '요청한 메모를 저장했어요.',
  },
  'success-edited': {
    savedMemo: '저녁 8시로 변경',
    inputMemo: '저녁 8시로 변경. 우산도 챙기기',
    changed: true,
    busy: false,
    message: '요청한 메모를 저장했어요.',
  },
} satisfies Record<string, MemoViewProps>

export function getPreview(value: string | null): MemoViewProps | undefined {
  return value && Object.hasOwn(previews, value) ? previews[value as keyof typeof previews] : undefined
}
