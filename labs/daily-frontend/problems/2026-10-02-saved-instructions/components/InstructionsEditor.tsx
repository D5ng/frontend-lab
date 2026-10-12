import { type SaveInstructions } from '../api'
import { InstructionsForm } from './InstructionsForm'
import { PublishedInstructions } from './PublishedInstructions'
import { useInstructionsForm } from '../hooks/useInstructionsForm'

export type InstructionsEditorProps = { saveInstructions: SaveInstructions }

/**
 * 분리 이유:
 * - 중간 컴포넌트를 만들지 않고, Problem.tsx에서 모두 import하여 사용할 수 있지만, `InstructionsHeading` 컴포넌트가 불필요하게 리렌더링이 발생한다.
 * - 따라서 불필요한 리렌더링을 줄이기 위해 상태를 필요로하는 컴포넌트들을 모은 중간 컴포넌트로 구성했다.
 *
 * 이 컴포넌트가 꼭 필요한걸까?
 * - 성능과 아키텍쳐의 트레이드오프라고 생각한다. 이 컴포넌트에서 리렌더링이 발생하면 `InstructionsHeading` 컴포넌트도 리렌더링 된다. 이를 막기 위해 컴포넌트 자체를 React.memo() 고차 컴포넌트를 활용할 수 있지만, 캐싱이란 비용이 든다.
 * - 결정적으로는 조금 더 앞서나간 설계 vs 현재에 집중한 설계라고 생각한다. 나는 굳이 불필요하게 연산될 필요가 없다고 생각했고, 이게 실제 서비스라면 나중에 처리하는것보다 지금 당장 신경쓰는게 맞다고 판단했다.
 *
 * AI가 하는 말:
 * - 성능에 대해 이야기할거라면, 얼마나 빨라졌는지에 대해 설명할 수 있어야한다.
 * - 따라서, 성능적인 부분보다 함께 변경되는 것들이 같이 있는지를 설명하는 응집도에 대한 이야기를 하는게 더 낫다고 한다.
 */
export function InstructionsEditor({ saveInstructions }: InstructionsEditorProps) {
  const { draftText, publishedText, draftError, saveResult, isSubmitting, actionDisabled, handleDraftChange, handleRestore, handleSubmit } =
    useInstructionsForm({
      saveInstructions,
    })

  return (
    <>
      <PublishedInstructions publishedText={publishedText} />
      <InstructionsForm
        draftText={draftText}
        saveResult={saveResult}
        draftError={draftError}
        actionDisabled={actionDisabled}
        isSubmitting={isSubmitting}
        onDraftChange={handleDraftChange}
        onRestore={handleRestore}
        onSave={handleSubmit}
      />
    </>
  )
}
