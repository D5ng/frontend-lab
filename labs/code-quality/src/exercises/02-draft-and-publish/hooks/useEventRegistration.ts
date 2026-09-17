import { useState } from 'react'

import { createInitialEventFormData, createSubmissionEventFormData, type EventFormData } from '../model/eventForm'
import { getPublishValidationMessage } from '../policy/publishValidationMessage'

type Action = 'draft' | 'publish'

interface UseEventRegistrationOptions {
  onSaveDraft: (formData: EventFormData) => Promise<void>
  onPublish: (formData: EventFormData) => Promise<void>
}

export function useEventRegistration({ onSaveDraft, onPublish }: UseEventRegistrationOptions) {
  const [eventFormData, setEventFormData] = useState(createInitialEventFormData)
  const [processingAction, setProcessingAction] = useState<Action | null>(null)
  const [resultMessage, setResultMessage] = useState('')

  const updateFormData = <Key extends keyof EventFormData>(key: Key, value: EventFormData[Key]) => {
    setResultMessage('')
    setEventFormData((prevFormData) => ({ ...prevFormData, [key]: value }))
  }

  async function runAction(action: Action) {
    if (processingAction !== null) {
      return
    }

    const formData = createSubmissionEventFormData(eventFormData)

    if (action === 'publish') {
      const validationMessage = getPublishValidationMessage(formData)

      if (validationMessage !== null) {
        setResultMessage(validationMessage)
        return
      }
    }

    setProcessingAction(action)
    setResultMessage('')

    try {
      if (action === 'draft') {
        await onSaveDraft(formData)
        setResultMessage('임시 저장했어요.')
      } else {
        await onPublish(formData)
        setEventFormData(createInitialEventFormData())
        setResultMessage('행사를 게시했어요.')
      }
    } catch {
      setResultMessage('작업을 완료하지 못했어요. 다시 시도해 주세요.')
    } finally {
      setProcessingAction(null)
    }
  }

  return {
    eventFormData,
    processingAction,
    resultMessage,
    updateFormData,
    saveDraft: () => runAction('draft'),
    publish: () => runAction('publish'),
  }
}
