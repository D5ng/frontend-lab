import { HStack, Skeleton, Text, VStack } from '@seed-design/react'
import { type ActivityComponentType, useActions } from '@stackflow/react'
import { useState } from 'react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { BottomSheetRoot } from 'seed-design/ui/bottom-sheet'
import { Callout } from 'seed-design/ui/callout'
import { SegmentedControl, SegmentedControlItem } from 'seed-design/ui/segmented-control'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'
import { MaturitySummary } from './components/MaturitySummary'
import { useProduct } from './hooks/useProduct'
import { calculateSavingsMaturity, isMonthlyAmountInRange } from './savings'
import { TermCompareSheet } from './TermCompareSheet'
import { formatAnnualRate, formatWon } from './utils/format'

export const SavingsHome: ActivityComponentType = () => {
  const { push } = useActions()
  const { product, loadFailed, handleReload } = useProduct()

  const [amountText, setAmountText] = useState('')
  const [months, setMonths] = useState(12)
  const [compareOpen, setCompareOpen] = useState(false)

  if (!product) {
    return (
      <AppScreen>
        <AppBar>
          <AppBarMain title="적금 계산하기" />
        </AppBar>
        <AppScreenContent>
          {loadFailed ? (
            <VStack gap="x4" px="x5" py="x6">
              <Callout tone="critical" description="상품 정보를 불러오지 못했어요. 잠시 후 다시 불러와 주세요." />
              <ActionButton variant="neutralWeak" size="medium" onClick={handleReload}>
                다시 불러오기
              </ActionButton>
            </VStack>
          ) : (
            <VStack gap="x6" px="x5" py="x6" aria-busy="true" aria-label="상품 정보를 불러오는 중">
              <Skeleton height="x14" radius="8" />
              <Skeleton height="x10" radius="8" />
              <Skeleton height="x24" radius="8" />
            </VStack>
          )}
        </AppScreenContent>
      </AppScreen>
    )
  }

  const monthlyAmount = Number(amountText)
  const isAmountValid = amountText !== '' && isMonthlyAmountInRange(monthlyAmount, product)
  console.log('isAmountValid', isAmountValid)

  const selectedTerm = product.terms.find((term) => term.months === months) ?? product.terms[0]
  const { principal, interest, tax, afterTaxInterest, maturityAmount } = calculateSavingsMaturity(
    monthlyAmount,
    months,
    selectedTerm.annualRate,
  )

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
                invalid={amountText !== '' && !isAmountValid}
                description={`한 달에 ${formatWon(product.minMonthlyAmount)}부터 ${formatWon(product.maxMonthlyAmount)}까지 넣을 수 있어요.`}
                errorMessage={`${formatWon(product.minMonthlyAmount)}부터 ${formatWon(product.maxMonthlyAmount)} 사이로 넣어 주세요.`}
              >
                <TextFieldInput inputMode="numeric" placeholder="300000" />
              </TextField>

              <VStack gap="x3">
                <HStack justifyContent="space-between">
                  <Text textStyle="t4Bold">기간</Text>
                  <Text textStyle="t4Regular" color="fg.neutralSubtle">
                    연 {formatAnnualRate(selectedTerm.annualRate)} · 단리
                  </Text>
                </HStack>
                <SegmentedControl aria-label="기간" value={String(months)} onValueChange={(value) => setMonths(Number(value))}>
                  {product.terms.map((term) => (
                    <SegmentedControlItem key={term.months} value={String(term.months)}>
                      {term.months}개월
                    </SegmentedControlItem>
                  ))}
                </SegmentedControl>
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
                    annualRate: selectedTerm.annualRate,
                    principal,
                    interest,
                    tax,
                    maturityAmount,
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
          onSelect={(nextMonths) => {
            setMonths(nextMonths)
            setCompareOpen(false)
          }}
        />
      </AppScreen>
    </BottomSheetRoot>
  )
}
