import { useState } from 'react'
import { ExpenseSplitPage } from './pages/ExpenseSplitPage'
import { createSplitApi } from './split/api'
import { ExpenseSplitView } from './split/ExpenseSplitView'
import { splitPreviews } from './split/preview'

export function Problem() {
  const [api] = useState(createSplitApi)
  const preview = new URLSearchParams(window.location.search).get('split-preview')
  if (preview && splitPreviews[preview]) return <ExpenseSplitView {...splitPreviews[preview]} />
  return <ExpenseSplitPage api={api} />
}
