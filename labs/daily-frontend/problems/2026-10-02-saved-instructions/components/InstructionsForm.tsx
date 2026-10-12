import { Callout, HStack, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { TextField, TextFieldTextarea } from 'seed-design/ui/text-field'
import { SAVE_RESULT_NOTICE, SaveResult } from '../model/instructions'

interface Props {
  draftText: string
  draftError: boolean
  isSubmitting: boolean
  actionDisabled: boolean
  saveResult?: SaveResult
  onDraftChange?: (text: string) => void
  onSave?: () => void
  onRestore?: () => void
}

/**
 * 사용자 입력 필드, 되돌리기, 저장하기, 안내 문구, 로딩 상태를 보여주는 폼 관심사를 담은 컴포넌트다.
 */
export function InstructionsForm({
  draftText,
  draftError,
  isSubmitting,
  actionDisabled,
  saveResult,
  onDraftChange,
  onRestore,
  onSave,
}: Props) {
  return (
    <VStack
      as="form"
      gap="x5"
      onSubmit={(event) => {
        event.preventDefault()
        onSave?.()
      }}
    >
      <TextField
        label="거래 안내"
        value={draftText}
        onValueChange={({ value }) => onDraftChange?.(value)}
        disabled={isSubmitting}
        invalid={draftError}
        errorMessage={'거래 안내를 입력해 주세요.'}
        description="저장하기를 눌러야 이웃에게 변경된 안내가 보여요."
      >
        <TextFieldTextarea placeholder="예: 오후 7시, 아파트 정문에서 만나요." style={{ minHeight: 120, maxHeight: 240 }} />
      </TextField>

      {isSubmitting && (
        <Text textStyle="t3Regular" color="fg.neutralMuted" role="status" aria-live="polite">
          저장 중...
        </Text>
      )}

      {saveResult && (
        <Callout.Root tone={SAVE_RESULT_NOTICE[saveResult].tone} role="status" aria-live="polite">
          <Callout.Content>
            <Callout.Description>{SAVE_RESULT_NOTICE[saveResult].message}</Callout.Description>
          </Callout.Content>
        </Callout.Root>
      )}

      <HStack gap="x3" className="instructions-actions">
        <ActionButton type="button" variant="neutralWeak" size="large" disabled={actionDisabled} onClick={onRestore}>
          되돌리기
        </ActionButton>
        <ActionButton
          type="submit"
          variant="brandSolid"
          size="large"
          loading={isSubmitting}
          disabled={actionDisabled}
          aria-label={isSubmitting ? '저장 중...' : '저장하기'}
        >
          {isSubmitting ? '저장 중...' : '저장하기'}
        </ActionButton>
      </HStack>
    </VStack>
  )
}
