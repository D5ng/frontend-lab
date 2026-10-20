import { useState } from 'react'
import { Callout, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { RadioGroup, RadioGroupItem } from 'seed-design/ui/radio-group'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'
import type { SendTransfer, TransferReceipt } from '../features/transfer/types/transfer'
import './TransferPage.css'

const accounts = [
  { id: 'living', name: '생활비 계좌', balance: 60000 },
  { id: 'pocket', name: '용돈 계좌', balance: 10000 },
]

export function TransferPage({ sendTransfer }: { sendTransfer: SendTransfer }) {
  const [accountId, setAccountId] = useState('living')
  const [bank, setBank] = useState<'same' | 'other'>('same')
  const [rawAmount, setRawAmount] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [amountError, setAmountError] = useState('')
  const [receipt, setReceipt] = useState<TransferReceipt | null>(null)
  const amount = Number(rawAmount)
  const account = accounts.find((item) => item.id === accountId)!

  async function submit() {
    if (pending || receipt) return
    setError('')
    setAmountError('')
    if (amount < 1000 || amount > 1000000) {
      setAmountError('1,000원부터 1,000,000원까지 입력해 주세요.')
      return
    }
    if (amount + (bank === 'other' && amount < 50000 ? 500 : 0) > account.balance) {
      setError('수수료를 포함한 출금액이 잔액보다 많아요.')
      return
    }
    setPending(true)
    try {
      const result = await sendTransfer({
        accountId,
        bank,
        amount,
        fee: bank === 'other' && amount < 50000 ? 500 : 0,
        totalDebit: amount + (bank === 'other' && amount < 50000 ? 500 : 0),
      })
      setReceipt(result)
    } catch {
      setError('송금 신청을 완료하지 못했어요. 다시 시도해 주세요.')
    } finally {
      setPending(false)
    }
  }

  return (
    <VStack as="article" gap="x6" px="x4" py="x6" width="full" aria-labelledby="transfer-heading">
      <VStack as="header" gap="x2">
        <Text as="h2" id="transfer-heading" textStyle="t7Bold">
          송금 신청
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          연습용 수취인에게 보낼 금액과 출금액을 확인해 주세요. 실제 돈은 이동하지 않아요.
        </Text>
      </VStack>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void submit()
        }}
      >
        <VStack gap="x5" width="full">
          <RadioGroup
            label="출금 계좌"
            value={accountId}
            disabled={pending || !!receipt}
            onValueChange={(value) => {
              if (!accounts.some((item) => item.id === value)) return
              setAccountId(value)
              setError('')
              setAmountError('')
            }}
          >
            {accounts.map((item) => (
              <RadioGroupItem
                className="transfer-choice"
                key={item.id}
                value={item.id}
                label={`${item.name} · 잔액 ${item.balance.toLocaleString('ko-KR')}원`}
              />
            ))}
          </RadioGroup>
          <RadioGroup
            label="받는 은행"
            value={bank}
            disabled={pending || !!receipt}
            onValueChange={(value) => {
              if (value !== 'same' && value !== 'other') return
              setBank(value)
              setError('')
              setAmountError('')
            }}
          >
            <RadioGroupItem className="transfer-choice" value="same" label="같은 은행" />
            <RadioGroupItem className="transfer-choice" value="other" label="다른 은행" />
          </RadioGroup>
          <TextField
            label="보낼 금액"
            value={rawAmount ? amount.toLocaleString('ko-KR') : ''}
            disabled={pending || !!receipt}
            invalid={!!amountError}
            errorMessage={amountError}
            description="1,000원 이상 · 최대 1,000,000원"
            suffix="원"
            onValueChange={({ value }) => {
              setRawAmount(value.replace(/\D/g, '').slice(0, 7))
              setError('')
              setAmountError('')
            }}
          >
            <TextFieldInput inputMode="numeric" />
          </TextField>
          <VStack as="section" gap="x2" aria-label="출금 요약">
            <Text textStyle="t4Regular">받는 금액 {amount.toLocaleString('ko-KR')}원</Text>
            <Text textStyle="t4Regular">
              수수료 {(bank === 'other' && amount > 0 && amount < 50000 ? 500 : 0).toLocaleString('ko-KR')}원
            </Text>
            <Text textStyle="t5Bold">
              총 출금액 {(amount + (bank === 'other' && amount > 0 && amount < 50000 ? 500 : 0)).toLocaleString('ko-KR')}원
            </Text>
            <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle">
              다른 은행은 500원, 50,000원 이상은 무료예요.
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
                <Callout.Description>
                  송금 신청을 완료했어요. 받는 금액 {receipt.amount.toLocaleString('ko-KR')}원 · 수수료{' '}
                  {receipt.fee.toLocaleString('ko-KR')}원 · 총 출금액 {receipt.totalDebit.toLocaleString('ko-KR')}원
                </Callout.Description>
              </Callout.Content>
            </Callout.Root>
          )}
          <ActionButton type="submit" variant="neutralSolid" size="large" loading={pending} disabled={pending || !!receipt || !rawAmount}>
            {pending ? '신청 중' : receipt ? '신청 완료' : '송금 신청하기'}
          </ActionButton>
          <Text as="p" textStyle="t3Regular" color="fg.neutralSubtle">
            {pending
              ? '신청을 처리하고 있어요. 잠시 기다려 주세요.'
              : receipt
                ? '완료한 신청은 이 화면에서 다시 보낼 수 없어요.'
                : !rawAmount
                  ? '보낼 금액을 입력해 주세요.'
                  : '첫 요청은 실패해요. 같은 내용으로 다시 시도해 보세요.'}
          </Text>
        </VStack>
      </form>
    </VStack>
  )
}
