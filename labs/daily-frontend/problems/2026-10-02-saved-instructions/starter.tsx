import type { SaveInstructions } from './api'
import { uiPreviews } from './preview'
import { InstructionsView } from './view'

export type InstructionsEditorProps = { saveInstructions: SaveInstructions }

export function InstructionsEditor(_props: InstructionsEditorProps) {
  // TODO: 초기 화면만 준비돼 있습니다. 필요한 상태와 사용자 행동을 직접 구현하세요.
  // view.tsx는 표현용 코드입니다. 사용할 수도, 이 파일에서 화면과 함께 구현할 수도 있습니다.
  // uiPreviews는 시각 검수용 고정값이며 실제 편집/저장 로직이 아닙니다.
  return <InstructionsView {...uiPreviews.initial} />
}
