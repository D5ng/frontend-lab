import { VStack } from '@seed-design/react'
import { useState } from 'react'
import { createSaveMock } from './api'
import { InstructionsEditor } from './components/InstructionsEditor'
import { InstructionsHeading } from './components/InstructionsHeading'
import { TestInstructionsView } from './components/TestInstructionsView'
import { uiPreviews } from './preview'
import './style.css'

export function Problem() {
  const [saveInstructions] = useState(() => createSaveMock())
  const preview = new URLSearchParams(window.location.search).get('ui-preview')
  // 검수용 주소를 사용한 경우에만 정적인 상태 예시를 표시합니다.
  if (preview && uiPreviews[preview]) {
    return <TestInstructionsView {...uiPreviews[preview]} />
  }

  return (
    <VStack as="section" aria-label="거래 안내 편집" gap="x6" px="x5" py="x6" className="instructions-screen">
      <InstructionsHeading />
      <InstructionsEditor saveInstructions={saveInstructions} />
    </VStack>
  )
}
