import { INITIAL_MEMO } from '../apis/initialMemo'
import type { MemoViewProps } from './MemoView'

// 검수용 고정 화면 데이터입니다. 사용자 이벤트나 저장 흐름을 구현하지 않습니다.
export const previews = {
  initial: { savedMemo: INITIAL_MEMO, inputMemo: INITIAL_MEMO, changed: false, loading: false, saveResult: null, disabled: true },
  editing: { savedMemo: INITIAL_MEMO, inputMemo: '저녁 8시로 변경', changed: true, loading: false, saveResult: null, disabled: false },
  empty: { savedMemo: INITIAL_MEMO, inputMemo: '', changed: true, loading: false, saveResult: null, disabled: false },
  loading: {
    savedMemo: INITIAL_MEMO,
    inputMemo: '저녁 8시로 변경. 우산도 챙기기',
    changed: true,
    loading: true,
    saveResult: null,
    disabled: true,
  },
  error: {
    savedMemo: INITIAL_MEMO,
    inputMemo: '저녁 8시로 변경. 우산도 챙기기',
    changed: true,
    loading: false,
    saveResult: 'error',
    disabled: false,
  },
  success: {
    savedMemo: '저녁 8시로 변경',
    inputMemo: '저녁 8시로 변경',
    changed: false,
    loading: false,
    saveResult: 'success',
    disabled: false,
    // message: '요청한 메모를 저장했어요.',
  },
  'success-edited': {
    savedMemo: '저녁 8시로 변경',
    inputMemo: '저녁 8시로 변경. 우산도 챙기기',
    changed: true,
    loading: false,
    saveResult: 'success',
    disabled: false,
    // message: '요청한 메모를 저장했어요.',
  },
} satisfies Record<string, MemoViewProps>

export function getPreview(value: string | null): MemoViewProps | undefined {
  return value && Object.hasOwn(previews, value) ? previews[value as keyof typeof previews] : undefined
}
