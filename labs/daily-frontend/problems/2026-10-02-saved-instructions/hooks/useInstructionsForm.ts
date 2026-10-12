import { useState } from 'react'
import { SaveInstructions } from '../api'
import { INITIAL_INSTRUCTIONS, InstructionsForm, isDraftTextBlank } from '../model/instructions'

interface Params {
  saveInstructions: SaveInstructions
}

const INITIAL_INSTRUCTIONS_STATE: InstructionsForm = {
  draftText: INITIAL_INSTRUCTIONS,
  draftError: false,
  publishedText: INITIAL_INSTRUCTIONS,
  isSubmitting: false,
}

/**
 * 거래 안내 폼 (사용자 입력, 되돌리기, 저장하기, 로딩 상태)의 로직을 책임지는 훅
 *
 * 분리한 이유:
 * - UI와 로직이 함께 있으면 파일을 연 시점에서 해당 코드들이 "무엇을" 하는지 알아야하고, 정돈되어 있지 않아 코드를 한 번씩 읽기는 해야한다.
 * - 하지만 분리하고, 의도를 나타내면 UI에서는 "무엇을" 하는지 파악하기 쉬워지고 단순하게 보인다. 사람이 쉽게 이해할 수 있다는것의 목적이 크다.
 */
export function useInstructionsForm({ saveInstructions }: Params) {
  const [formState, setFormState] = useState<InstructionsForm>(INITIAL_INSTRUCTIONS_STATE)

  const { draftText, publishedText, isSubmitting } = formState

  const handleDraftChange = (text: string) => {
    setFormState((prevState) => ({ ...prevState, draftText: text, saveResult: undefined, draftError: false }))
  }

  const handleRestore = () => {
    setFormState((prevState) => ({ ...prevState, draftText: publishedText, draftError: false, saveResult: undefined }))
  }

  const handleSubmit = async () => {
    if (isDraftTextBlank(draftText)) {
      setFormState((prevState) => ({ ...prevState, draftError: true }))
      return
    }

    setFormState((prevState) => ({ ...prevState, isSubmitting: true }))
    try {
      const publishedText = (await saveInstructions({ text: draftText.trim() })).text
      setFormState((prevState) => ({ ...prevState, draftText: publishedText, publishedText, saveResult: 'success' }))
    } catch {
      setFormState((prevState) => ({ ...prevState, saveResult: 'error' }))
    } finally {
      setFormState((prevState) => ({ ...prevState, isSubmitting: false }))
    }
  }

  const actionDisabled = isSubmitting || draftText.trim() === publishedText

  return {
    ...formState,
    actionDisabled,
    handleDraftChange,
    handleRestore,
    handleSubmit,
  }
}
