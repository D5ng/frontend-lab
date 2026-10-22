import { Callout, Text, VStack } from '@seed-design/react'
import { useState } from 'react'
import { ActionButton } from 'seed-design/ui/action-button'
import { RadioGroup, RadioGroupItem } from 'seed-design/ui/radio-group'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'
import type { ExportReceipt, RequestExport } from '../features/exportRequest/types/exportRequest'
import './ExportPage.css'

export function ExportPage({ requestExport }: { requestExport: RequestExport }) {
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv')
  const [name, setName] = useState('활동 기록')
  const [delimiter, setDelimiter] = useState<'comma' | 'tab'>('comma')
  const [detail, setDetail] = useState<'summary' | 'full'>('summary')
  const [nameError, setNameError] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [receipt, setReceipt] = useState<ExportReceipt | null>(null)

  return (
    <VStack as="article" className="export-request" gap="x6" px="x5" py="x6">
      <VStack as="header" gap="x2">
        <Text as="h2" textStyle="t7Bold">
          활동 기록 내보내기
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          함께 한 작업 기록을 원하는 형식으로 받아 보세요.
        </Text>
      </VStack>
      <VStack
        as="form"
        gap="x5"
        onSubmit={async (event) => {
          event.preventDefault()
          if (pending || receipt) return
          const trimmedName = name.trim()
          if (trimmedName.length < 1 || trimmedName.length > 20 || /[./\\]/.test(trimmedName)) {
            setNameError('이름은 1~20자로, 마침표와 슬래시 없이 입력해 주세요.')
            return
          }
          setNameError('')
          setError('')
          setPending(true)
          try {
            const result = await requestExport(
              format === 'csv' ? { format: 'csv', name: trimmedName, delimiter } : { format: 'pdf', name: trimmedName, detail },
            )
            setReceipt(result)
          } catch {
            setError('내보내기를 접수하지 못했어요. 다시 시도해 주세요.')
          } finally {
            setPending(false)
          }
        }}
      >
        <RadioGroup
          label="파일 형식"
          value={format}
          disabled={pending}
          onValueChange={(value) => {
            if (value !== 'csv' && value !== 'pdf') return
            setFormat(value)
            setError('')
            setNameError('')
            setReceipt(null)
          }}
        >
          <RadioGroupItem className="export-request-choice" value="csv" label="CSV · 표로 편집" />
          <RadioGroupItem className="export-request-choice" value="pdf" label="PDF · 문서로 공유" />
        </RadioGroup>
        <TextField
          label="파일 이름"
          value={name}
          disabled={pending}
          invalid={!!nameError}
          errorMessage={nameError}
          description="확장자는 자동으로 붙어요. 앞뒤 공백은 제외해요."
          onValueChange={({ value }) => {
            setName(value)
            setNameError('')
            setError('')
            setReceipt(null)
          }}
        >
          <TextFieldInput />
        </TextField>
        {format === 'csv' ? (
          <RadioGroup
            label="열 구분"
            value={delimiter}
            disabled={pending}
            onValueChange={(value) => {
              if (value !== 'comma' && value !== 'tab') return
              setDelimiter(value)
              setError('')
              setNameError('')
              setReceipt(null)
            }}
          >
            <RadioGroupItem className="export-request-choice" value="comma" label="쉼표로 구분" />
            <RadioGroupItem className="export-request-choice" value="tab" label="탭으로 구분" />
          </RadioGroup>
        ) : (
          <RadioGroup
            label="문서 내용"
            value={detail}
            disabled={pending}
            onValueChange={(value) => {
              if (value !== 'summary' && value !== 'full') return
              setDetail(value)
              setError('')
              setNameError('')
              setReceipt(null)
            }}
          >
            <RadioGroupItem className="export-request-choice" value="summary" label="작업 제목만" />
            <RadioGroupItem className="export-request-choice" value="full" label="작업 제목과 메모" />
          </RadioGroup>
        )}
        <VStack as="aside" aria-label="내보내기 요약" gap="x2">
          <Text textStyle="t5Bold">내보내기 요약</Text>
          <Text textStyle="t4Regular">
            {name.trim() || '이름을 입력해 주세요'}
            {format === 'csv' ? '.csv' : '.pdf'}
          </Text>
          <Text textStyle="t4Regular" color="fg.neutralSubtle">
            {format === 'csv'
              ? delimiter === 'comma'
                ? '쉼표로 열 구분'
                : '탭으로 열 구분'
              : detail === 'summary'
                ? '작업 제목만 포함'
                : '작업 제목과 메모 포함'}
          </Text>
        </VStack>
        {error && (
          <Callout.Root tone="critical" role="alert">
            <Callout.Content>
              <Callout.Description>{error}</Callout.Description>
            </Callout.Content>
          </Callout.Root>
        )}
        {receipt && (
          <Callout.Root tone="positive" role="status">
            <Callout.Content>
              <Callout.Description>{receipt.fileName} 내보내기를 접수했어요.</Callout.Description>
            </Callout.Content>
          </Callout.Root>
        )}
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          {pending
            ? '접수 중에는 설정을 바꿀 수 없어요.'
            : receipt
              ? '설정을 바꾸면 새로 신청할 수 있어요.'
              : '이름을 입력하고 내보내기를 신청해 주세요.'}
        </Text>
        <ActionButton type="submit" size="large" variant="neutralSolid" loading={pending} disabled={pending || !name.trim() || !!receipt}>
          {pending ? '접수 중' : '내보내기 신청'}
        </ActionButton>
      </VStack>
    </VStack>
  )
}
