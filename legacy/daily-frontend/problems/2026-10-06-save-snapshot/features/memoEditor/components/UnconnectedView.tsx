import { Callout } from '@seed-design/react'

export function UnconnectedView() {
  return (
    <Callout.Root tone="neutral">
      <Callout.Content>
        <Callout.Description>
          아직 입력·저장·되돌리기 로직이 연결되지 않았어요. pages/MemoEditorPage.tsx에서 구현해 주세요.
        </Callout.Description>
      </Callout.Content>
    </Callout.Root>
  )
}
