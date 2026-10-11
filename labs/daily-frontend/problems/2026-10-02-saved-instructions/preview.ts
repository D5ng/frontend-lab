import { INITIAL_INSTRUCTIONS } from './api'
import type { InstructionsViewProps } from './view'

const initial: InstructionsViewProps = {
  text: INITIAL_INSTRUCTIONS,
  publishedText: INITIAL_INSTRUCTIONS,
  busy: false,
  saveDisabled: true,
  restoreDisabled: true,
}

// 정적인 UI 검수용 값입니다. 상태 전이나 저장 로직을 구현하지 않습니다.
export const uiPreviews: Record<string, InstructionsViewProps> = {
  initial,
  editing: { ...initial, text: '내일 오후 3시, 도서관 앞에서 만나요.', saveDisabled: false, restoreDisabled: false },
  empty: { ...initial, text: '', saveDisabled: false, restoreDisabled: false, fieldError: '거래 안내를 입력해 주세요.' },
  loading: { ...initial, text: '내일 오후 3시, 도서관 앞에서 만나요.', busy: true },
  error: {
    ...initial,
    text: '내일 오후 3시, 도서관 앞에서 만나요.',
    saveDisabled: false,
    restoreDisabled: false,
    message: '저장하지 못했어요. 다시 시도해 주세요.',
    messageTone: 'critical',
  },
  success: {
    ...initial,
    text: '내일 오후 3시, 도서관 앞에서 만나요.',
    publishedText: '내일 오후 3시, 도서관 앞에서 만나요.',
    message: '거래 안내를 저장했어요.',
  },
}
