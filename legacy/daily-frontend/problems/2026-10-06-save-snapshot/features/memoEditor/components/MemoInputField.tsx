import { Text } from '@seed-design/react'
import { TextField, TextFieldTextarea } from 'seed-design/ui/text-field'

interface Props {
  inputMemo: string
  changed: boolean
  unconnected?: boolean
  onInputChange?: (value: string) => void
}

export function MemoInputField({ inputMemo, changed, unconnected, onInputChange }: Props) {
  return (
    <>
      <TextField
        label="메모 내용"
        value={inputMemo}
        onValueChange={({ value }) => onInputChange?.(value)}
        readOnly={unconnected}
        description="빈 내용도 저장할 수 있어요. 메모는 나에게만 보여요."
      >
        <TextFieldTextarea
          placeholder="만날 시간이나 챙길 물건을 적어 주세요."
          className="memo-input"
          style={{ minHeight: 'calc(var(--seed-dimension-x12) * 2)', maxHeight: 'calc(var(--seed-dimension-x12) * 5)' }}
        />
      </TextField>
      <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle" aria-live="polite">
        {changed ? '아직 저장하지 않은 변경이 있어요.' : '저장된 내용과 같아요.'}
      </Text>
    </>
  )
}
