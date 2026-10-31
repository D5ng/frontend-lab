import { HStack, Text, VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { INTEREST_TAX_PERCENT } from '../savings'
import { formatWon } from '../utils/format'

interface Props {
  principal: number
  afterTaxInterest: number
  maturityAmount: number
  onCompareOpen: () => void
}

export function MaturitySummary({ principal, afterTaxInterest, maturityAmount, onCompareOpen }: Props) {
  return (
    <VStack gap="x3">
      <VStack gap="x3" p="x4" bg="bg.neutralWeak" borderRadius="r3">
        <HStack justifyContent="space-between">
          <Text color="fg.neutralSubtle">넣는 돈</Text>
          <Text>{formatWon(principal)}</Text>
        </HStack>
        <HStack justifyContent="space-between">
          <Text color="fg.neutralSubtle">{`이자 (세금 ${INTEREST_TAX_PERCENT}% 뗀 뒤)`}</Text>
          <Text>{formatWon(afterTaxInterest)}</Text>
        </HStack>
        <HStack justifyContent="space-between">
          <Text textStyle="t5Bold">만기에 받는 돈</Text>
          <Text textStyle="t5Bold">{formatWon(maturityAmount)}</Text>
        </HStack>
      </VStack>
      <ActionButton variant="neutralWeak" size="medium" onClick={onCompareOpen}>
        기간별로 비교하기
      </ActionButton>
    </VStack>
  )
}
