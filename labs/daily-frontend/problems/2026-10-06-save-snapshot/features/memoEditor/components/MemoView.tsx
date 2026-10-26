import { Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import type { SaveResult } from '../types/memo'
import { MemoHeading } from './MemoHeading'
import { MemoInputField } from './MemoInputField'
import { SavedMemo } from './SavedMemo'
import { SaveResultNotice } from './SaveResultNotice'
import { UnconnectedView } from './UnconnectedView'
import './MemoView.css'

// 화면 표현용 계약입니다. 같은 이름의 상태를 각각 만들라는 뜻은 아닙니다.
export type MemoViewProps = {
  savedMemo: string
  inputMemo: string
  changed: boolean
  loading: boolean
  saveResult: SaveResult | null
  disabled: boolean
  unconnected?: boolean
  onInputChange?: (value: string) => void
  onSave?: () => void
  onRestore?: () => void
}

export function MemoView({
  inputMemo,
  savedMemo,
  loading,
  saveResult,
  changed,
  disabled,
  unconnected,
  onInputChange,
  onRestore,
  onSave,
}: MemoViewProps) {
  return (
    <VStack as="article" className="memo-screen" width="full" px="x5" py="x6" gap="x5" aria-labelledby="memo-heading">
      <MemoHeading />

      {unconnected && <UnconnectedView />}

      <SavedMemo savedMemo={savedMemo} />

      <MemoInputField inputMemo={inputMemo} changed={changed} unconnected={unconnected} onInputChange={onInputChange} />

      {loading && (
        <Text as="p" role="status" textStyle="t3Regular" color="fg.neutralSubtle">
          요청한 내용을 저장 중이에요. 입력은 계속할 수 있어요.
        </Text>
      )}

      {saveResult && <SaveResultNotice result={saveResult} />}

      <VStack gap="x3">
        <ActionButton
          variant="neutralSolid"
          size="large"
          loading={loading}
          disabled={disabled || unconnected}
          aria-label={loading ? '메모 저장 중' : '메모 저장하기'}
          onClick={onSave}
        >
          {loading ? '메모 저장 중' : '메모 저장하기'}
        </ActionButton>
        <ActionButton variant="neutralWeak" size="large" disabled={disabled || unconnected} onClick={onRestore}>
          저장된 내용으로 되돌리기
        </ActionButton>
      </VStack>
    </VStack>
  )
}
