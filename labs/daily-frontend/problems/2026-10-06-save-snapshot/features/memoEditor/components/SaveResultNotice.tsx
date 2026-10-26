import { Callout } from '@seed-design/react'
import type { NoticeResult, SaveResult } from '../types/memo'

interface Props {
  result: SaveResult
}

export function SaveResultNotice({ result }: Props) {
  return (
    <Callout.Root tone={NOTICE_BY_RESULT[result].tone} role={NOTICE_BY_RESULT[result].role}>
      <Callout.Content>
        <Callout.Description>{NOTICE_BY_RESULT[result].message}</Callout.Description>
      </Callout.Content>
    </Callout.Root>
  )
}

const NOTICE_BY_RESULT: Record<SaveResult, NoticeResult> = {
  success: {
    tone: 'positive',
    role: 'status',
    message: '요청한 메모를 저장했어요.',
  },
  error: {
    tone: 'critical',
    role: 'alert',
    message: '저장하지 못했어요. 작성 중인 내용은 그대로예요. 다시 시도해 주세요.',
  },
}
