import { INITIAL_INSTRUCTIONS, SaveResult } from './model/instructions'

type INITIAL_STATE = {
  draftText: string
  draftError: boolean
  publishedText: string
  isSubmitting: boolean
  actionDisabled: boolean
  saveResult?: SaveResult
}

const initial: INITIAL_STATE = {
  draftText: INITIAL_INSTRUCTIONS,
  draftError: false,
  publishedText: INITIAL_INSTRUCTIONS,
  isSubmitting: false,
  actionDisabled: true,
  saveResult: undefined,
}

// 정적인 UI 검수용 값입니다. 상태 전이나 저장 로직을 구현하지 않습니다.
export const uiPreviews: Record<string, INITIAL_STATE> = {
  initial,
  editing: { ...initial, draftText: '내일 오후 3시, 도서관 앞에서 만나요.', actionDisabled: false },
  empty: { ...initial, draftText: '', actionDisabled: false, draftError: true },
  loading: { ...initial, draftText: '내일 오후 3시, 도서관 앞에서 만나요.', isSubmitting: true },
  error: {
    ...initial,
    draftText: '내일 오후 3시, 도서관 앞에서 만나요.',
    actionDisabled: false,
    saveResult: 'error',
  },
  success: {
    ...initial,
    draftText: '내일 오후 3시, 도서관 앞에서 만나요.',
    publishedText: '내일 오후 3시, 도서관 앞에서 만나요.',
    saveResult: 'success',
  },
}
