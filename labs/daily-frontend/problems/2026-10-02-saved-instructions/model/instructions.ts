export interface InstructionsForm {
  draftText: string
  draftError: boolean
  publishedText: string
  isSubmitting: boolean
  saveResult?: SaveResult
}

export type SaveResult = 'success' | 'error'

export const INITIAL_INSTRUCTIONS = '평일 저녁 7시 이후, 아파트 정문에서 만나요.'

export const SAVE_RESULT_NOTICE = {
  success: {
    tone: 'positive',
    message: '거래 안내를 저장했어요.',
  },
  error: {
    tone: 'critical',
    message: '저장하지 못했어요. 다시 시도해 주세요.',
  },
} as const

export function isDraftTextBlank(text: string) {
  return text.trim() === ''
}
