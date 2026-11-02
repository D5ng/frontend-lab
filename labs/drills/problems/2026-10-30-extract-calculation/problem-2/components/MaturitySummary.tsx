import { VStack } from '@seed-design/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { INTEREST_TAX_PERCENT } from '../savings'
import { formatWon } from '../utils/format'
import { SummaryRow } from './SummaryRow'

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
        <SummaryRow label="넣는 돈" value={formatWon(principal)} />
        <SummaryRow label={`이자 (세금 ${INTEREST_TAX_PERCENT}% 뗀 뒤)`} value={formatWon(afterTaxInterest)} />
        <SummaryRow label="만기에 받는 돈" value={formatWon(maturityAmount)} isTotal />
      </VStack>
      <ActionButton variant="neutralWeak" size="medium" onClick={onCompareOpen}>
        기간별로 비교하기
      </ActionButton>
    </VStack>
  )
}
