import type { SubmitEvent } from 'react'
import { Button, FlexBox, FormControl, FormField, FormLabel, RadioGroup, RadioGroupItem, TextField, Typography } from '@wanteddev/wds'

import { useEventRegistration } from './hooks/useEventRegistration'
import type { EventFormData, EventType } from './model/eventForm'

export type { EventFormData } from './model/eventForm'

type ProblemProps = {
  onSaveDraft?: (formData: EventFormData) => Promise<void>
  onPublish?: (formData: EventFormData) => Promise<void>
}

async function completeImmediately() {
  return undefined
}

export function Problem({ onSaveDraft = completeImmediately, onPublish = completeImmediately }: ProblemProps) {
  const { eventFormData, processingAction, resultMessage, updateFormData, saveDraft, publish } = useEventRegistration({
    onSaveDraft,
    onPublish,
  })

  function isEventType(value: string): value is EventType {
    return value === 'online' || value === 'offline'
  }

  function handlePublish(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    void publish()
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
            onValueChange={(value) => {
              if (!isEventType(value)) {
                return
              }

              updateFormData('eventType', value)
            }}
            orientation="horizontal"
            value={eventFormData.eventType}
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
              onChange={(event) => updateFormData('title', event.currentTarget.value)}
              placeholder="예: 프런트엔드 품질 세미나"
              value={eventFormData.title}
              width="100%"
            />
          </FormControl>
        </FormField>

        {eventFormData.eventType === 'online' ? (
          <FormField>
            <FormLabel>온라인 접속 URL</FormLabel>
            <FormControl>
              <TextField
                disabled={processingAction !== null}
                name="onlineUrl"
                onChange={(event) => updateFormData('onlineUrl', event.currentTarget.value)}
                placeholder="예: https://example.com/event"
                value={eventFormData.onlineUrl}
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
                onChange={(event) => updateFormData('offlineLocation', event.currentTarget.value)}
                placeholder="예: 강남구 테헤란로 1"
                value={eventFormData.offlineLocation}
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
            onClick={() => void saveDraft()}
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
