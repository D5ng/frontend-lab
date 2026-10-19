import { MemoView } from '../features/memoEditor/components/MemoView'
import type { SaveMemo } from '../features/memoEditor/types/memo'

export type MemoEditorProps = { initialMemo: string; saveMemo: SaveMemo }

export function MemoEditorPage({ initialMemo }: MemoEditorProps) {
  // TODO: 입력·저장 요청·응답 반영·실패·되돌리기를 직접 구현하세요.
  // saveMemo 주입 경계는 유지합니다. 상태와 함수의 구조는 자유입니다.
  return <MemoView savedMemo={initialMemo} inputMemo={initialMemo} changed={false} busy={false} unconnected />
}
