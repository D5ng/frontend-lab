import { useState } from 'react'
import { INITIAL_MEMO } from '../apis/initialMemo'
import type { SaveMemo, SaveResult } from '../types/memo'

export function useMemoEditor(saveMemo: SaveMemo, initialMemo?: string) {
  const [loading, setLoading] = useState(false)
  const [saveResult, setSaveResult] = useState<SaveResult | null>(null)

  const [savedMemo, setSavedMemo] = useState(initialMemo ?? INITIAL_MEMO)
  const [inputMemo, setInputMemo] = useState(initialMemo ?? INITIAL_MEMO)

  const clearFeedback = () => {
    setSaveResult(null)
  }

  const handleInputChange = (value: string) => {
    setInputMemo(value)
    clearFeedback()
  }

  const handleRestore = () => {
    setInputMemo(savedMemo)
    clearFeedback()
  }

  const save = async () => {
    setLoading(true)

    if (disabled) {
      return
    }

    try {
      const saved = await saveMemo({ memo: inputMemo })
      setSavedMemo(saved.memo)
      setSaveResult('success')
    } catch {
      setSaveResult('error')
    } finally {
      setLoading(false)
    }
  }

  const changed = savedMemo !== inputMemo

  const disabled = loading || !changed

  return {
    savedMemo,
    inputMemo,
    loading,
    saveResult,
    changed,
    disabled,
    handleInputChange,
    handleRestore,
    save,
  }
}
