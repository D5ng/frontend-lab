import { Divider, HStack, Text, VStack } from '@seed-design/react'
import type { ActivityComponentType } from '@stackflow/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { Callout } from 'seed-design/ui/callout'
import { useOpenSavingsAccount } from './hooks/useOpenSavingsAccount'
import { INTEREST_TAX_PERCENT } from './savings'
import { formatAnnualRate, formatWon } from './utils/format'

type SavingsConfirmParams = {
  productId: string
  productName: string
  monthlyAmount: number
  months: number
  annualRate: number
  interest: number
  tax: number
  principal: number
  maturityAmount: number
}

export const SavingsConfirm: ActivityComponentType<SavingsConfirmParams> = ({ params }) => {
  const { productId, monthlyAmount, months, annualRate, interest, tax, principal, maturityAmount } = params
  const { submitting, failed, handleSubmit } = useOpenSavingsAccount({ productId, monthlyAmount, months })

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
              <HStack justifyContent="space-between">
                <Text color="fg.neutralSubtle">상품</Text>
                <Text>{params.productName}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="fg.neutralSubtle">매달 넣는 돈</Text>
                <Text>{formatWon(monthlyAmount)}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="fg.neutralSubtle">기간</Text>
                <Text>{months}개월</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="fg.neutralSubtle">금리</Text>
                <Text>연 {formatAnnualRate(annualRate)}</Text>
              </HStack>
            </VStack>

            <Divider />

            <VStack gap="x3">
              <HStack justifyContent="space-between">
                <Text color="fg.neutralSubtle">넣는 돈 합계</Text>
                <Text>{formatWon(principal)}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="fg.neutralSubtle">세전 이자</Text>
                <Text>{formatWon(interest)}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="fg.neutralSubtle">{`이자에 붙는 세금 (${INTEREST_TAX_PERCENT}%)`}</Text>
                <Text>-{formatWon(tax)}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text textStyle="t5Bold">만기에 받는 돈</Text>
                <Text textStyle="t5Bold">{formatWon(maturityAmount)}</Text>
              </HStack>
            </VStack>

            {failed && <Callout tone="critical" description="가입하지 못했어요. 잠시 후 다시 시도해 주세요." />}
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
            <ActionButton variant="brandSolid" size="large" loading={submitting} disabled={submitting} onClick={handleSubmit}>
              가입하기
            </ActionButton>
          </VStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  )
}
