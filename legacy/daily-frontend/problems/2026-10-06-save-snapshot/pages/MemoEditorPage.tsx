import { MemoView } from '../features/memoEditor/components/MemoView'
import { useMemoEditor } from '../features/memoEditor/hooks/useMemoEditor'
import type { SaveMemo } from '../features/memoEditor/types/memo'

export type MemoEditorProps = { initialMemo: string; saveMemo: SaveMemo }

export function MemoEditorPage({ initialMemo, saveMemo }: MemoEditorProps) {
  const { savedMemo, inputMemo, changed, loading, disabled, saveResult, handleInputChange, handleRestore, save } = useMemoEditor(
    saveMemo,
    initialMemo,
  )

  return (
    <MemoView
      savedMemo={savedMemo}
      inputMemo={inputMemo}
      changed={changed}
      loading={loading}
      saveResult={saveResult}
      disabled={disabled}
      onInputChange={handleInputChange}
      onRestore={handleRestore}
      onSave={save}
    />
  )
}
