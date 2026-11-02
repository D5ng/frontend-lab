import { HStack, Text, VStack } from '@seed-design/react'
import { useActions } from '@stackflow/react'
import { useState } from 'react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { BottomSheetRoot } from 'seed-design/ui/bottom-sheet'
import { Checkbox } from 'seed-design/ui/checkbox'
import { SegmentedControl, SegmentedControlItem } from 'seed-design/ui/segmented-control'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'
import type { SavingsProduct, SavingsTerm } from '../api'
import { AUTO_TRANSFER_RATE, calculateAppliedRate, calculateSavingsMaturity, getInitialMonths, isMonthlyAmountInRange } from '../savings'
import { formatAnnualRate, formatWon } from '../utils/format'
import { MaturitySummary } from './MaturitySummary'
import { TermCompareSheet } from './TermCompareSheet'

interface Props {
  product: SavingsProduct
}

export function SavingsCalculator({ product }: Props) {
  const { push } = useActions()

  const [amountText, setAmountText] = useState('')
  const [months, setMonths] = useState(getInitialMonths(product.terms))
  const [compareOpen, setCompareOpen] = useState(false)
  const [autoTransfer, setAutoTransfer] = useState(false)

  const monthlyAmount = Number(amountText)
  const isAmountEntered = amountText !== ''
  const isAmountValid = isAmountEntered && isMonthlyAmountInRange(monthlyAmount, product)

  // NOTE: months는 기본 값도 변경되는 값도 product.terms에서 항상 찾을 수 있다.
  const selectedTerm = product.terms.find((term) => term.months === months) as SavingsTerm
  const appliedRate = calculateAppliedRate(selectedTerm.annualRate, autoTransfer)
  const { principal, interest, tax, afterTaxInterest, maturityAmount } = calculateSavingsMaturity(monthlyAmount, months, appliedRate)

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
              <TextField
                label="매달 넣을 금액"
                suffix="원"
                value={amountText}
                onValueChange={({ value }) => setAmountText(value.replace(/\D/g, ''))}
                invalid={isAmountEntered && !isAmountValid}
                description={`한 달에 ${formatWon(product.minMonthlyAmount)}부터 ${formatWon(product.maxMonthlyAmount)}까지 넣을 수 있어요.`}
                errorMessage={`${formatWon(product.minMonthlyAmount)}부터 ${formatWon(product.maxMonthlyAmount)} 사이로 넣어 주세요.`}
              >
                <TextFieldInput inputMode="numeric" placeholder="300000" />
              </TextField>

              <VStack gap="x3">
                <HStack justifyContent="space-between">
                  <Text textStyle="t4Bold">기간</Text>
                  <Text textStyle="t4Regular" color="fg.neutralSubtle">
                    연 {formatAnnualRate(appliedRate)} · 단리
                  </Text>
                </HStack>
                <SegmentedControl
                  aria-label="기간"
                  value={String(months)}
                  onValueChange={(value) => {
                    setMonths(Number(value))
                  }}
                >
                  {product.terms.map((term) => (
                    <SegmentedControlItem key={term.months} value={String(term.months)}>
                      {term.months}개월
                    </SegmentedControlItem>
                  ))}
                </SegmentedControl>
                {/* 문제 3: 체크 상태와 우대 금리 계산은 직접 연결한다. */}
                <Checkbox
                  label={`자동이체로 넣고 연 ${formatAnnualRate(AUTO_TRANSFER_RATE)}p 더 받기`}
                  checked={autoTransfer}
                  onCheckedChange={(checked) => setAutoTransfer(checked)}
                />
              </VStack>

              {isAmountValid ? (
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

            <VStack
              position="sticky"
              bottom={0}
              bg="bg.layerDefault"
              borderTopWidth={1}
              borderColor="stroke.neutralSubtle"
              px="x5"
              pt="x3"
              pb="x5"
            >
              <ActionButton
                variant="brandSolid"
                size="large"
                disabled={!isAmountValid}
                onClick={() =>
                  push('SavingsConfirm', {
                    productId: product.id,
                    productName: product.name,
                    monthlyAmount,
                    months,
                    appliedRate,
                    principal,
                    interest,
                    tax,
                    maturityAmount,
                    autoTransfer,
                  })
                }
              >
                가입하기
              </ActionButton>
            </VStack>
          </VStack>
        </AppScreenContent>
        <TermCompareSheet
          terms={product.terms}
          monthlyAmount={monthlyAmount}
          selectedMonths={months}
          autoTransfer={autoTransfer}
          onSelect={(nextMonths) => {
            setMonths(nextMonths)
            setCompareOpen(false)
          }}
        />
      </AppScreen>
    </BottomSheetRoot>
  )
}
