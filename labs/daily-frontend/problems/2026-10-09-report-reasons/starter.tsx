import { useState } from 'react'
import { Callout, HStack, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { RadioGroup, RadioGroupItem } from 'seed-design/ui/radio-group'
import { TextField, TextFieldTextarea } from 'seed-design/ui/text-field'
import type { Reason, SendReport } from './api'

export function ReportForm({ sendReport }: { sendReport: SendReport }) {
  const [reason, setReason] = useState<Reason | ''>('')
  const [description, setDescription] = useState('')
  const [reasonError, setReasonError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const [failed, setFailed] = useState(false)
  const [sent, setSent] = useState(false)

  async function submit() {
    if (pending || sent) return
    setReasonError('')
    setDescriptionError('')
    setMessage('')
    if (!reason) {
      setReasonError('신고 사유를 골라 주세요.')
      return
    }
    if (reason === 'wrong-item' && description.trim().length < 5) {
      setDescriptionError('상품이 다른 점을 5자 이상 적어 주세요.')
      return
    }
    if (reason === 'other' && description.trim().length < 10) {
      setDescriptionError('신고할 상황을 10자 이상 적어 주세요.')
      return
    }
    setPending(true)
    try {
      await sendReport(reason === 'no-show' ? { reason } : { reason, description: description.trim() })
      setFailed(false)
      setSent(true)
      setMessage(
        reason === 'no-show'
          ? '약속 불참 신고를 접수했어요.'
          : reason === 'wrong-item'
            ? '상품 불일치 신고를 접수했어요.'
            : '기타 신고를 접수했어요.',
      )
    } catch {
      setFailed(true)
      setMessage('접수하지 못했어요. 작성한 내용은 그대로예요. 다시 시도해 주세요.')
    } finally {
      setPending(false)
    }
  }

  return (
    <VStack as="article" aria-label="거래 신고" p="x4" gap="x6" width="full">
      <VStack gap="x2">
        <Text as="h2" textStyle="t7Bold">
          거래 문제 알리기
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          어떤 일이 있었는지 알려 주세요. 접수 내용을 확인할게요.
        </Text>
      </VStack>
      <VStack asChild gap="x6">
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            void submit()
          }}
        >
          <RadioGroup
            label="신고 사유"
            value={reason}
            disabled={pending}
            invalid={!!reasonError}
            errorMessage={reasonError}
            onValueChange={(value) => {
              if (pending || value === reason || (value !== 'no-show' && value !== 'wrong-item' && value !== 'other')) return
              setReason(value)
              setReasonError('')
              setDescriptionError('')
              setMessage('')
              setSent(false)
            }}
          >
            <VStack gap="x2">
              <HStack asChild py="x3">
                <RadioGroupItem value="no-show" label="약속 장소에 나오지 않았어요" size="large" tone="neutral" />
              </HStack>
              <HStack asChild py="x3">
                <RadioGroupItem value="wrong-item" label="설명과 다른 상품을 받았어요" size="large" tone="neutral" />
              </HStack>
              <HStack asChild py="x3">
                <RadioGroupItem value="other" label="다른 문제가 있었어요" size="large" tone="neutral" />
              </HStack>
            </VStack>
          </RadioGroup>
          {(reason === 'wrong-item' || reason === 'other') && (
            <VStack gap="x2">
              <TextField
                label="상황 설명"
                description={reason === 'wrong-item' ? '상품이 다른 점을 5자 이상 적어 주세요.' : '신고할 상황을 10자 이상 적어 주세요.'}
                value={description}
                disabled={pending}
                invalid={!!descriptionError}
                errorMessage={descriptionError}
                onValueChange={({ value }) => {
                  if (pending || value === description) return
                  setDescription(value)
                  setDescriptionError('')
                  setMessage('')
                  setSent(false)
                }}
              >
                <TextFieldTextarea
                  style={{ minHeight: 'calc(var(--seed-dimension-x12) * 2)', maxHeight: 'calc(var(--seed-dimension-x12) * 5)' }}
                  placeholder="어떤 일이 있었는지 적어 주세요"
                />
              </TextField>
              <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle">
                앞뒤 공백을 뺀 {description.trim().length}자 / 최소 {reason === 'wrong-item' ? 5 : 10}자
              </Text>
            </VStack>
          )}
          {reason === 'no-show' && (
            <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
              약속 불참은 사유만 접수해요. 설명을 따로 적지 않아도 돼요.
            </Text>
          )}
          {message && (
            <Callout.Root tone={failed ? 'critical' : 'positive'} role={failed ? 'alert' : 'status'}>
              <Callout.Content>
                <Callout.Description>{message}</Callout.Description>
              </Callout.Content>
            </Callout.Root>
          )}
          {pending && (
            <Text role="status" textStyle="t3Regular">
              접수 중에는 사유와 설명을 바꿀 수 없어요.
            </Text>
          )}
          <ActionButton
            type="submit"
            variant="neutralSolid"
            size="large"
            loading={pending}
            disabled={pending || sent}
            aria-label={pending ? '신고 접수 중' : '신고 접수하기'}
          >
            신고 접수하기
          </ActionButton>
        </form>
      </VStack>
    </VStack>
  )
}
