import { HStack, Skeleton, Text, VStack } from '@seed-design/react'
import { type ActivityComponentType, useActions } from '@stackflow/react'
import { useEffect, useState } from 'react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { BottomSheetRoot } from 'seed-design/ui/bottom-sheet'
import { Callout } from 'seed-design/ui/callout'
import { SegmentedControl, SegmentedControlItem } from 'seed-design/ui/segmented-control'
import { TextField, TextFieldInput } from 'seed-design/ui/text-field'
import { fetchSavingsProduct, type SavingsProduct } from './api'
import { TermCompareSheet } from './TermCompareSheet'

export const SavingsHome: ActivityComponentType = () => {
  const { push } = useActions()
  const [product, setProduct] = useState<SavingsProduct | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [reloadCount, setReloadCount] = useState(0)
  const [amountText, setAmountText] = useState('')
  const [months, setMonths] = useState(12)
  const [compareOpen, setCompareOpen] = useState(false)

  useEffect(() => {
    let ignore = false
    fetchSavingsProduct()
      .then((data) => {
        if (!ignore) setProduct(data)
      })
      .catch(() => {
        if (!ignore) setLoadFailed(true)
      })
    return () => {
      ignore = true
    }
  }, [reloadCount])

  function handleReload() {
    setLoadFailed(false)
    setReloadCount((count) => count + 1)
  }

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
  const isAmountValid = amountText !== '' && monthlyAmount >= product.minMonthlyAmount && monthlyAmount <= product.maxMonthlyAmount
  const selectedTerm = product.terms.find((term) => term.months === months) ?? product.terms[0]

  const principal = monthlyAmount * months
  const interest = Math.floor(monthlyAmount * (selectedTerm.annualRate / 100 / 12) * ((months * (months + 1)) / 2))
  const tax = Math.floor(interest * 0.154)
  const maturityAmount = principal + interest - tax

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
                description={`한 달에 ${product.minMonthlyAmount.toLocaleString('ko-KR')}원부터 ${product.maxMonthlyAmount.toLocaleString('ko-KR')}원까지 넣을 수 있어요.`}
                errorMessage={`${product.minMonthlyAmount.toLocaleString('ko-KR')}원부터 ${product.maxMonthlyAmount.toLocaleString('ko-KR')}원 사이로 넣어 주세요.`}
              >
                <TextFieldInput inputMode="numeric" placeholder="300000" />
              </TextField>

              <VStack gap="x3">
                <HStack justifyContent="space-between">
                  <Text textStyle="t4Bold">기간</Text>
                  <Text textStyle="t4Regular" color="fg.neutralSubtle">
                    연 {selectedTerm.annualRate.toFixed(1)}% · 단리
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
                <VStack gap="x3">
                  <VStack gap="x3" p="x4" bg="bg.neutralWeak" borderRadius="r3">
                    <HStack justifyContent="space-between">
                      <Text color="fg.neutralSubtle">넣는 돈</Text>
                      <Text>{principal.toLocaleString('ko-KR')}원</Text>
                    </HStack>
                    <HStack justifyContent="space-between">
                      <Text color="fg.neutralSubtle">이자 (세금 15.4% 뗀 뒤)</Text>
                      <Text>{(interest - tax).toLocaleString('ko-KR')}원</Text>
                    </HStack>
                    <HStack justifyContent="space-between">
                      <Text textStyle="t5Bold">만기에 받는 돈</Text>
                      <Text textStyle="t5Bold">{maturityAmount.toLocaleString('ko-KR')}원</Text>
                    </HStack>
                  </VStack>
                  <ActionButton variant="neutralWeak" size="medium" onClick={() => setCompareOpen(true)}>
                    기간별로 비교하기
                  </ActionButton>
                </VStack>
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
