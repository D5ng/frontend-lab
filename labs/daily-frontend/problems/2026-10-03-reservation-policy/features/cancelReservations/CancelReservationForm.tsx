import { ActionButton, Callout, VStack } from '@seed-design/react'
import { SubmitEvent } from 'react'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'
import { CancelReservationResult } from './useCancelReservationForm'
import { MIN_CANCEL_REASON_LENGTH } from './cancelPolicy'

interface Props {
  reason: string
  result: CancelReservationResult | null
  pending: boolean
  disabled: boolean
  fieldError: string
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void
  onReasonChange: (reason: string) => void
}

export function CancelReservationForm({ result, reason, pending, disabled, fieldError, onSubmit, onReasonChange }: Props) {
  return (
    <form onSubmit={onSubmit}>
      <VStack gap="x4">
        <TextField
          label="취소 사유"
          description={`앞뒤 공백을 제외하고 ${MIN_CANCEL_REASON_LENGTH}자 이상 입력해 주세요.`}
          variant="underline"
          value={reason}
          onValueChange={({ value }) => onReasonChange(value)}
          invalid={!!fieldError}
          errorMessage={fieldError}
          disabled={disabled}
        >
          <TextFieldInput placeholder="예: 개인 일정이 생겼어요" />
        </TextField>
        <ActionButton
          type="submit"
          variant="neutralSolid"
          size="large"
          loading={pending}
          aria-label={pending ? '취소 중...' : '예약 취소하기'}
          disabled={disabled}
        >
          {pending ? '취소 중...' : '예약 취소하기'}
        </ActionButton>
        <div role="status" aria-live="polite">
          {result && (
            <Callout.Root tone={result.tone}>
              <Callout.Content>
                <Callout.Description>{result.message}</Callout.Description>
              </Callout.Content>
            </Callout.Root>
          )}
        </div>
      </VStack>
    </form>
  )
}
