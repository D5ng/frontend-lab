import { Divider, Text, VStack } from '@seed-design/react'
import type { ActivityComponentType } from '@stackflow/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { Callout } from 'seed-design/ui/callout'
import { useOpenSavingsAccount } from '../hooks/useOpenSavingsAccount'
import { AUTO_TRANSFER_BONUS_RATE, INTEREST_TAX_PERCENT } from '../savings'
import { formatAnnualRate, formatWon } from '../utils/format'
import { BottomActionBar } from './BottomActionBar'
import { SummaryRow } from './SummaryRow'

type SavingsConfirmParams = {
  productId: string
  productName: string
  monthlyAmount: number
  months: number
  appliedRate: number
  interest: number
  tax: number
  principal: number
  maturityAmount: number
  autoTransfer: boolean
}

export const SavingsConfirm: ActivityComponentType<SavingsConfirmParams> = ({ params }) => {
  const { productId, monthlyAmount, months, appliedRate, interest, tax, principal, maturityAmount, autoTransfer } = params
  const { submitting, failed, handleSubmit } = useOpenSavingsAccount({ productId, monthlyAmount, months, autoTransfer })

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="가입 내용 확인" />
      </AppBar>
      <AppScreenContent>
        <VStack minHeight="full">
          <VStack flexGrow gap="x6" px="x5" py="x6">
            <VStack gap="x1">
              <Text as="h2" textStyle="t6Bold">
                이대로 가입할까요?
              </Text>
              <Text textStyle="t4Regular" color="fg.neutralSubtle">
                금리는 가입한 날 정해지고 만기까지 바뀌지 않아요.
              </Text>
            </VStack>

            <VStack gap="x3">
              <SummaryRow label="상품" value={params.productName} />
              <SummaryRow label="매달 넣는 돈" value={formatWon(monthlyAmount)} />
              <SummaryRow label="기간" value={`${months}개월`} />
              {/* 문제 3: 자동이체로 가입할 때만 보여 준다. */}
              <SummaryRow
                label="금리"
                value={`연 ${formatAnnualRate(appliedRate)}`}
                description={autoTransfer ? `자동이체 우대 ${formatAnnualRate(AUTO_TRANSFER_BONUS_RATE)}p 포함` : undefined}
              />
            </VStack>

            <Divider />

            <VStack gap="x3">
              <SummaryRow label="넣는 돈 합계" value={formatWon(principal)} />
              <SummaryRow label="세전 이자" value={formatWon(interest)} />
              <SummaryRow label={`이자에 붙는 세금 (${INTEREST_TAX_PERCENT}%)`} value={`-${formatWon(tax)}`} />
              <SummaryRow label="만기에 받는 돈" value={formatWon(maturityAmount)} isTotal />
            </VStack>

            {failed && <Callout tone="critical" description="가입하지 못했어요. 잠시 후 다시 시도해 주세요." />}
          </VStack>

          <BottomActionBar>
            <ActionButton variant="brandSolid" size="large" loading={submitting} disabled={submitting} onClick={handleSubmit}>
              가입하기
            </ActionButton>
          </BottomActionBar>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  )
}
