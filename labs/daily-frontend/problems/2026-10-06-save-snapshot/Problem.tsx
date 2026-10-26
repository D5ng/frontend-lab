import { useState } from 'react'
import { createDemoSaver } from './features/memoEditor/apis/createDemoSaver'
import { INITIAL_MEMO } from './features/memoEditor/apis/initialMemo'
import { MemoView } from './features/memoEditor/components/MemoView'
import { getPreview } from './features/memoEditor/components/MemoView.preview'
import { MemoEditorPage } from './pages/MemoEditorPage'

export function Problem() {
  const [saveMemo] = useState(createDemoSaver)
  const preview = getPreview(new URLSearchParams(window.location.search).get('memo-preview'))
  return preview ? <MemoView {...preview} /> : <MemoEditorPage initialMemo={INITIAL_MEMO} saveMemo={saveMemo} />
}
