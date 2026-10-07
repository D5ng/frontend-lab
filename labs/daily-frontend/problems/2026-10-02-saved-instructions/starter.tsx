import { useState } from 'react'
import { INITIAL_INSTRUCTIONS, type SaveInstructions } from './api'
import { InstructionsView } from './view'

export type InstructionsEditorProps = { saveInstructions: SaveInstructions }

interface EditorState {
  draftText: string
  publishedText: string
  isSubmitting: boolean
  saveResult?: 'success' | 'error'
}

export function InstructionsEditor({ saveInstructions }: InstructionsEditorProps) {
  const [{ draftText, publishedText, isSubmitting, saveResult }, setEditorState] = useState<EditorState>({
    draftText: INITIAL_INSTRUCTIONS,
    publishedText: INITIAL_INSTRUCTIONS,
    isSubmitting: false,
  })

  const handleDraftTextChange = (text: string) => {
    setEditorState((prevState) => ({ ...prevState, draftText: text, saveResult: undefined }))
  }

  const handleRestore = () => {
    setEditorState((prevState) => ({ ...prevState, draftText: publishedText }))
  }

  const handleSubmit = async () => {
    const trimmed = draftText.trim()

    if (trimmed === '') {
      return
    }

    setEditorState((prevState) => ({ ...prevState, isSubmitting: true }))
    try {
      const publishedText = (await saveInstructions({ text: trimmed })).text
      setEditorState((prevState) => ({ ...prevState, draftText: publishedText, publishedText, saveResult: 'success' }))
    } catch {
      setEditorState((prevState) => ({ ...prevState, saveResult: 'error' }))
    } finally {
      setEditorState((prevState) => ({ ...prevState, isSubmitting: false }))
    }
  }

  const actionDisabled = isSubmitting || draftText.trim() === publishedText

  return (
    <InstructionsView
      draftText={draftText}
      publishedText={publishedText}
      isSubmitting={isSubmitting}
      saveResult={saveResult}
      actionDisabled={actionDisabled}
      onTextChange={handleDraftTextChange}
      onRestore={handleRestore}
      onSave={handleSubmit}
    />
  )
}
