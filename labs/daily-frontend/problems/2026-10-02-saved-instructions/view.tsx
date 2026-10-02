import { Box, Callout, HStack, Text, VStack } from '@seed-design/react'
import { ActionButton } from '../../src/seed-design/ui/action-button'
import { TextField, TextFieldTextarea } from '../../src/seed-design/ui/text-field'
import './style.css'

// 화면을 그리는 데 필요한 값입니다. 같은 이름의 상태를 모두 만들라는 뜻은 아닙니다.
export type InstructionsViewProps = {
  text: string
  publishedText: string
  busy: boolean
  saveDisabled: boolean
  restoreDisabled: boolean
  fieldError?: string
  message?: string
  messageTone?: 'critical' | 'positive'
  onTextChange?: (text: string) => void
  onSave?: () => void
  onRestore?: () => void
}

export function InstructionsView(props: InstructionsViewProps) {
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
            {props.publishedText}
          </Text>
        </VStack>
      </Box>

      <VStack
        as="form"
        gap="x5"
        onSubmit={(event) => {
          event.preventDefault()
          props.onSave?.()
        }}
      >
        <TextField
          label="거래 안내"
          value={props.text}
          onValueChange={({ value }) => props.onTextChange?.(value)}
          disabled={props.busy}
          invalid={!!props.fieldError}
          errorMessage={props.fieldError}
          description="저장하기를 눌러야 이웃에게 변경된 안내가 보여요."
        >
          <TextFieldTextarea placeholder="예: 오후 7시, 아파트 정문에서 만나요." style={{ minHeight: 120, maxHeight: 240 }} />
        </TextField>

        {props.busy && (
          <Text textStyle="t3Regular" color="fg.neutralMuted" role="status" aria-live="polite">
            저장 중...
          </Text>
        )}

        {props.message && (
          <Callout.Root tone={props.messageTone ?? 'positive'} role="status" aria-live="polite">
            <Callout.Content>
              <Callout.Description>{props.message}</Callout.Description>
            </Callout.Content>
          </Callout.Root>
        )}

        <HStack gap="x3" className="instructions-actions">
          <ActionButton
            type="button"
            variant="neutralWeak"
            size="large"
            disabled={props.busy || props.restoreDisabled}
            onClick={props.onRestore}
          >
            되돌리기
          </ActionButton>
          <ActionButton
            type="submit"
            variant="brandSolid"
            size="large"
            loading={props.busy}
            disabled={props.busy || props.saveDisabled}
            aria-label={props.busy ? '저장 중...' : '저장하기'}
          >
            {props.busy ? '저장 중...' : '저장하기'}
          </ActionButton>
        </HStack>
      </VStack>
    </VStack>
  )
}
