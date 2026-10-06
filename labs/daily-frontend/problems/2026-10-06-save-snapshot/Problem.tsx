import { useState } from 'react'
import { INITIAL_MEMO, createDemoSaver } from './api'
import { getPreview } from './preview'
import { MemoEditor } from './starter'
import { MemoView } from './view'

export function Problem() {
  const [saveMemo] = useState(createDemoSaver)
  const preview = getPreview(new URLSearchParams(window.location.search).get('memo-preview'))
  return preview ? <MemoView {...preview} /> : <MemoEditor initialMemo={INITIAL_MEMO} saveMemo={saveMemo} />
}
