import { Text, VStack } from '@seed-design/react'
import { useActions } from '@stackflow/react'
import { useState } from 'react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { BottomSheetRoot } from 'seed-design/ui/bottom-sheet'
import type { SavingsProduct } from '../api'
import { useAmountInput } from '../hooks/useAmountInput'
import { useSelectedTerm } from '../hooks/useSelectedTerm'
import { calculateTermMaturity } from '../savings'
import { BottomActionBar } from './BottomActionBar'
import { MaturitySummary } from './MaturitySummary'
import { MonthlyAmountField } from './MonthlyAmountField'
import { TermAndAutoTransferField } from './TermAndAutoTransferField'
import { TermCompareSheet } from './TermCompareSheet'

interface Props {
  product: SavingsProduct
}

export function SavingsCalculator({ product }: Props) {
  const { push } = useActions()

  const { amountText, monthlyAmount, amountStatus, handleAmountChange } = useAmountInput(product)
  const { selectedTerm, selectMonths } = useSelectedTerm(product.terms)
  const [compareOpen, setCompareOpen] = useState(false)
  const [autoTransfer, setAutoTransfer] = useState(false)

  const { appliedRate, principal, interest, tax, afterTaxInterest, maturityAmount } = calculateTermMaturity(
    monthlyAmount,
    selectedTerm,
    autoTransfer,
  )

  const goToConfirm = () =>
    push('SavingsConfirm', {
      productId: product.id,
      productName: product.name,
      monthlyAmount,
      months: selectedTerm.months,
      appliedRate,
      principal,
      interest,
      tax,
      maturityAmount,
      autoTransfer,
    })

  return (
    // 시트는 스크롤되는 AppScreenContent 밖에 둬야 화면 아래에 제자리로 열린다.
    <BottomSheetRoot open={compareOpen} onOpenChange={setCompareOpen}>
      <AppScreen>
        <AppBar>
          <AppBarMain title="적금 계산하기" subtitle={product.name} />
        </AppBar>
        <AppScreenContent>
          <VStack minHeight="full">
            <VStack flexGrow gap="x8" px="x5" py="x6">
              <MonthlyAmountField
                amountText={amountText}
                isOutOfRange={amountStatus === 'outOfRange'}
                minMonthlyAmount={product.minMonthlyAmount}
                maxMonthlyAmount={product.maxMonthlyAmount}
                onAmountChange={handleAmountChange}
              />

              <TermAndAutoTransferField
                appliedRate={appliedRate}
                selectedMonths={selectedTerm.months}
                terms={product.terms}
                autoTransfer={autoTransfer}
                onSelectMonths={selectMonths}
                onAutoTransferChange={setAutoTransfer}
              />

              {amountStatus === 'valid' ? (
                <MaturitySummary
                  principal={principal}
                  afterTaxInterest={afterTaxInterest}
                  maturityAmount={maturityAmount}
                  onCompareOpen={() => setCompareOpen(true)}
                />
              ) : (
                <Text textStyle="t4Regular" color="fg.neutralSubtle">
                  매달 넣을 금액을 입력하면 만기에 받는 돈을 알려 드려요.
                </Text>
              )}
            </VStack>

            <BottomActionBar>
              <ActionButton variant="brandSolid" size="large" disabled={amountStatus !== 'valid'} onClick={goToConfirm}>
                가입하기
              </ActionButton>
            </BottomActionBar>
          </VStack>
        </AppScreenContent>
        <TermCompareSheet
          terms={product.terms}
          monthlyAmount={monthlyAmount}
          selectedMonths={selectedTerm.months}
          autoTransfer={autoTransfer}
          onSelect={(nextMonths) => {
            selectMonths(nextMonths)
            setCompareOpen(false)
          }}
        />
      </AppScreen>
    </BottomSheetRoot>
  )
}
