import { Box, Callout, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { TextField, TextFieldTextarea } from 'seed-design/ui/text-field'
import './style.css'

// 화면 표현용 계약입니다. 같은 이름의 상태를 각각 만들라는 뜻은 아닙니다.
export type MemoViewProps = {
  savedMemo: string
  inputMemo: string
  changed: boolean
  busy: boolean
  message?: string
  failed?: boolean
  unconnected?: boolean
  onInputChange?: (value: string) => void
  onSave?: () => void
  onRestore?: () => void
}

export function MemoView(props: MemoViewProps) {
  return (
    <VStack as="article" className="memo-screen" width="full" px="x5" py="x6" gap="x5" aria-labelledby="memo-heading">
      <VStack as="header" gap="x2">
        <Text textStyle="t3Regular" color="fg.neutralSubtle">
          나만 보는 거래 기록
        </Text>
        <Text as="h2" id="memo-heading" textStyle="t7Bold">
          거래 메모
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          저장을 기다리는 동안에도 메모를 이어 쓸 수 있어요.
        </Text>
      </VStack>
      {props.unconnected && (
        <Callout.Root tone="neutral">
          <Callout.Content>
            <Callout.Description>아직 입력·저장·되돌리기 로직이 연결되지 않았어요. starter.tsx에서 구현해 주세요.</Callout.Description>
          </Callout.Content>
        </Callout.Root>
      )}
      <Box as="section" role="region" aria-label="마지막 저장된 메모" p="x4" bg="bg.neutralWeak" borderRadius="r3">
        <VStack gap="x2">
          <Text as="h3" textStyle="t4Bold">
            마지막 저장된 메모
          </Text>
          <Text as="p" textStyle="t4Regular" whiteSpace="pre-wrap">
            {props.savedMemo === '' ? '저장된 메모가 없어요.' : props.savedMemo}
          </Text>
        </VStack>
      </Box>
      <TextField
        label="메모 내용"
        value={props.inputMemo}
        onValueChange={({ value }) => props.onInputChange?.(value)}
        readOnly={props.unconnected}
        description="빈 내용도 저장할 수 있어요. 메모는 나에게만 보여요."
      >
        <TextFieldTextarea
          placeholder="만날 시간이나 챙길 물건을 적어 주세요."
          className="memo-input"
          style={{ minHeight: 'calc(var(--seed-dimension-x12) * 2)', maxHeight: 'calc(var(--seed-dimension-x12) * 5)' }}
        />
      </TextField>
      <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle" aria-live="polite">
        {props.changed ? '아직 저장하지 않은 변경이 있어요.' : '저장된 내용과 같아요.'}
      </Text>
      {props.busy && (
        <Text as="p" role="status" textStyle="t3Regular" color="fg.neutralSubtle">
          요청한 내용을 저장 중이에요. 입력은 계속할 수 있어요.
        </Text>
      )}
      {!props.busy && props.message && (
        <Callout.Root tone={props.failed ? 'critical' : 'positive'} role={props.failed ? 'alert' : 'status'}>
          <Callout.Content>
            <Callout.Description>{props.message}</Callout.Description>
          </Callout.Content>
        </Callout.Root>
      )}
      <VStack gap="x3">
        <ActionButton
          variant="neutralSolid"
          size="large"
          loading={props.busy}
          disabled={props.busy || !props.changed || props.unconnected}
          aria-label={props.busy ? '메모 저장 중' : '메모 저장하기'}
          onClick={props.onSave}
        >
          {props.busy ? '메모 저장 중' : '메모 저장하기'}
        </ActionButton>
        <ActionButton
          variant="neutralWeak"
          size="large"
          disabled={props.busy || !props.changed || props.unconnected}
          onClick={props.onRestore}
        >
          저장된 내용으로 되돌리기
        </ActionButton>
      </VStack>
    </VStack>
  )
}
