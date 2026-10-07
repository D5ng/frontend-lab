import { Box, Callout, HStack, Text, VStack } from '@seed-design/react'
import { ActionButton } from '../../src/seed-design/ui/action-button'
import { TextField, TextFieldTextarea } from '../../src/seed-design/ui/text-field'
import './style.css'

// 화면을 그리는 데 필요한 값입니다. 같은 이름의 상태를 모두 만들라는 뜻은 아닙니다.
export type InstructionsViewProps = {
  draftText: string
  publishedText: string
  isSubmitting: boolean
  saveResult?: 'success' | 'error'
  actionDisabled: boolean
  onTextChange?: (text: string) => void
  onSave?: () => void
  onRestore?: () => void
}

export function InstructionsView({
  draftText,
  publishedText,
  saveResult,
  actionDisabled,
  isSubmitting,
  onSave,
  onTextChange,
  onRestore,
}: InstructionsViewProps) {
  return (
    <VStack as="section" aria-label="거래 안내 편집" gap="x6" px="x5" py="x6" className="instructions-screen">
      <VStack gap="x2">
        <Text color="fg.neutralMuted" textStyle="t2Regular">
          나의 거래 설정
        </Text>
        <Text as="h2" textStyle="t7Bold">
          거래 안내 수정
        </Text>
        <Text color="fg.neutralMuted" textStyle="t3Regular">
          이웃에게 보여줄 만남 장소와 시간을 적어 주세요.
        </Text>
      </VStack>

      <Box as="section" aria-label="현재 공개된 안내" bg="bg.neutralWeak" p="x4" borderRadius="r3">
        <VStack gap="x2">
          <Text as="h3" textStyle="t3Bold">
            현재 공개된 안내
          </Text>
          <Text as="p" textStyle="t4Regular" whiteSpace="pre-wrap">
            {publishedText}
          </Text>
        </VStack>
      </Box>

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
          onValueChange={({ value }) => onTextChange?.(value)}
          disabled={isSubmitting}
          invalid={draftText.trim() === ''}
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
          <Callout.Root tone={saveResult === 'success' ? 'positive' : 'critical'} role="status" aria-live="polite">
            <Callout.Content>
              <Callout.Description>
                {saveResult === 'success' ? '거래 안내를 저장했어요.' : '저장하지 못했어요. 다시 시도해 주세요.'}
              </Callout.Description>
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
    </VStack>
  )
}
