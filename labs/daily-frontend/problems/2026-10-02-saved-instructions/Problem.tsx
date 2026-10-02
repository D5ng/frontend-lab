import { useState } from 'react'
import { createSaveMock } from './api'
import { uiPreviews } from './preview'
import { InstructionsEditor } from './starter'
import { InstructionsView } from './view'

export function Problem() {
  const [saveInstructions] = useState(() => createSaveMock())
  const preview = new URLSearchParams(window.location.search).get('ui-preview')
  // 검수용 주소를 사용한 경우에만 정적인 상태 예시를 표시합니다.
  if (preview && uiPreviews[preview]) return <InstructionsView {...uiPreviews[preview]} />
  return <InstructionsEditor saveInstructions={saveInstructions} />
}
