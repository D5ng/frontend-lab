import { useState, type SubmitEvent } from 'react'
import { Button, FlexBox, FormControl, FormField, FormLabel, RadioGroup, RadioGroupItem, TextField, Typography } from '@wanteddev/wds'

type EventType = 'online' | 'offline'
type Action = 'draft' | 'publish'

export type EventFormData = {
  eventType: EventType
  title: string
  onlineUrl: string
  offlineLocation: string
}

type ProblemProps = {
  onSaveDraft?: (formData: EventFormData) => Promise<void>
  onPublish?: (formData: EventFormData) => Promise<void>
}

async function completeImmediately() {
  return Promise.resolve()
}

export function Problem({ onSaveDraft = completeImmediately, onPublish = completeImmediately }: ProblemProps) {
  const [eventType, setEventType] = useState<EventType>('online')
  const [title, setTitle] = useState('')
  const [onlineUrl, setOnlineUrl] = useState('')
  const [offlineLocation, setOfflineLocation] = useState('')
  const [processingAction, setProcessingAction] = useState<Action | null>(null)
  const [resultMessage, setResultMessage] = useState('')

  function getFormData(): EventFormData {
    return {
      eventType,
      title: title.trim(),
      onlineUrl: onlineUrl.trim(),
      offlineLocation: offlineLocation.trim(),
    }
  }

  function getPublishValidationMessage(formData: EventFormData) {
    if (formData.title.length === 0) {
      return '행사 제목을 입력해 주세요.'
    }

    if (formData.eventType === 'online' && formData.onlineUrl.length === 0) {
      return '온라인 접속 URL을 입력해 주세요.'
    }

    if (formData.eventType === 'offline' && formData.offlineLocation.length === 0) {
      return '오프라인 장소를 입력해 주세요.'
    }

    return null
  }

  async function runAction(action: Action) {
    const formData = getFormData()

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
        setResultMessage('행사를 게시했어요.')
      }
    } catch {
      setResultMessage('작업을 완료하지 못했어요. 다시 시도해 주세요.')
    } finally {
      setProcessingAction(null)
    }
  }

  function handlePublish(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    void runAction('publish')
  }

  return (
    <FlexBox as="section" aria-labelledby="event-registration-title" className="event-registration-section" flexDirection="column">
      <FlexBox className="event-registration-header" flexDirection="column" gap="8px">
        <Typography as="h2" id="event-registration-title" variant="title2" weight="bold">
          행사 정보
        </Typography>
        <Typography as="p" color="semantic.label.alternative" variant="body2-reading">
          참여자가 행사 내용을 쉽게 이해할 수 있도록 작성해 주세요.
        </Typography>
      </FlexBox>

      <form className="event-registration-form" onSubmit={handlePublish}>
        <fieldset className="event-type-field">
          <Typography as="legend" variant="label1" weight="bold">
            행사 유형을 선택해 주세요.
          </Typography>
          <RadioGroup
            className="event-type-options"
            disabled={processingAction !== null}
            name="eventType"
            onValueChange={(nextEventType) => {
              setEventType(nextEventType as EventType)
              setResultMessage('')
            }}
            orientation="horizontal"
            value={eventType}
          >
            <FlexBox alignItems="center" gap="8px">
              <RadioGroupItem aria-label="온라인" value="online" />
              <Typography as="span" variant="body2">
                온라인
              </Typography>
            </FlexBox>
            <FlexBox alignItems="center" gap="8px">
              <RadioGroupItem aria-label="오프라인" value="offline" />
              <Typography as="span" variant="body2">
                오프라인
              </Typography>
            </FlexBox>
          </RadioGroup>
        </fieldset>

        <FormField>
          <FormLabel>행사 제목</FormLabel>
          <FormControl>
            <TextField
              disabled={processingAction !== null}
              name="title"
              onChange={(event) => setTitle(event.currentTarget.value)}
              placeholder="예: 프런트엔드 품질 세미나"
              value={title}
              width="100%"
            />
          </FormControl>
        </FormField>

        {eventType === 'online' ? (
          <FormField>
            <FormLabel>온라인 접속 URL</FormLabel>
            <FormControl>
              <TextField
                disabled={processingAction !== null}
                name="onlineUrl"
                onChange={(event) => setOnlineUrl(event.currentTarget.value)}
                placeholder="예: https://example.com/event"
                value={onlineUrl}
                width="100%"
              />
            </FormControl>
          </FormField>
        ) : (
          <FormField>
            <FormLabel>오프라인 장소</FormLabel>
            <FormControl>
              <TextField
                disabled={processingAction !== null}
                name="offlineLocation"
                onChange={(event) => setOfflineLocation(event.currentTarget.value)}
                placeholder="예: 강남구 테헤란로 1"
                value={offlineLocation}
                width="100%"
              />
            </FormControl>
          </FormField>
        )}

        <FlexBox className="event-registration-actions" flexDirection="column" gap="12px">
          <Button
            color="assistive"
            disabled={processingAction !== null}
            fullWidth
            loading={processingAction === 'draft'}
            onClick={() => void runAction('draft')}
            size="large"
            variant="outlined"
          >
            {processingAction === 'draft' ? '임시 저장 중...' : '임시 저장'}
          </Button>
          <Button disabled={processingAction !== null} fullWidth loading={processingAction === 'publish'} size="large" type="submit">
            {processingAction === 'publish' ? '게시 중...' : '게시하기'}
          </Button>
        </FlexBox>
      </form>

      <Typography aria-live="polite" className="event-registration-feedback" color="semantic.label.normal" variant="body2" weight="bold">
        {resultMessage}
      </Typography>
    </FlexBox>
  )
}
