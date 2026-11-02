import { HStack, Text, VStack } from '@seed-design/react'
import { Checkbox } from 'seed-design/ui/checkbox'
import { SegmentedControl, SegmentedControlItem } from 'seed-design/ui/segmented-control'
import type { SavingsTerm } from '../api'
import { AUTO_TRANSFER_BONUS_RATE } from '../savings'
import { formatAnnualRate } from '../utils/format'

interface Props {
  appliedRate: number
  selectedMonths: number
  terms: SavingsTerm[]
  autoTransfer: boolean
  onSelectMonths: (months: number) => void
  onAutoTransferChange: (checked: boolean) => void
}

export function TermAndAutoTransferField({
  appliedRate,
  selectedMonths,
  terms,
  autoTransfer,
  onSelectMonths,
  onAutoTransferChange,
}: Props) {
  return (
    <VStack gap="x3">
      <HStack justifyContent="space-between">
        <Text textStyle="t4Bold">기간</Text>
        <Text textStyle="t4Regular" color="fg.neutralSubtle">
          연 {formatAnnualRate(appliedRate)} · 단리
        </Text>
      </HStack>
      <SegmentedControl
        aria-label="기간"
        value={String(selectedMonths)}
        onValueChange={(value) => {
          onSelectMonths(Number(value))
        }}
      >
        {terms.map((term) => (
          <SegmentedControlItem key={term.months} value={String(term.months)}>
            {term.months}개월
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      {/* 문제 3: 체크 상태와 우대 금리 계산은 직접 연결한다. */}
      <Checkbox
        label={`자동이체로 넣고 연 ${formatAnnualRate(AUTO_TRANSFER_BONUS_RATE)}p 더 받기`}
        checked={autoTransfer}
        onCheckedChange={onAutoTransferChange}
      />
    </VStack>
  )
}
