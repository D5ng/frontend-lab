import { VStack } from '@seed-design/react'
import { InstructionsHeading } from './InstructionsHeading'
import { PublishedInstructions } from './PublishedInstructions'
import { InstructionsForm } from './InstructionsForm'
import { SaveResult } from '../model/instructions'

// 화면을 그리는 데 필요한 값입니다. 같은 이름의 상태를 모두 만들라는 뜻은 아닙니다.
interface Props {
  draftText: string
  draftError: boolean
  publishedText: string
  isSubmitting: boolean
  saveResult?: SaveResult
  actionDisabled: boolean
  onDraftChange?: (text: string) => void
  onRestore?: () => void
  onSave?: () => void
}

/**
 * 정적 테스트를 위한 컴포넌트
 */
export function TestInstructionsView({
  draftText,
  draftError,
  publishedText,
  saveResult,
  actionDisabled,
  isSubmitting,
  onDraftChange,
  onRestore,
  onSave,
}: Props) {
  return (
    <VStack as="section" aria-label="거래 안내 편집" gap="x6" px="x5" py="x6" className="instructions-screen">
      <InstructionsHeading />
      <PublishedInstructions publishedText={publishedText} />
      <InstructionsForm
        draftText={draftText}
        draftError={draftError}
        saveResult={saveResult}
        actionDisabled={actionDisabled}
        isSubmitting={isSubmitting}
        onDraftChange={onDraftChange}
        onRestore={onRestore}
        onSave={onSave}
      />
    </VStack>
  )
}
