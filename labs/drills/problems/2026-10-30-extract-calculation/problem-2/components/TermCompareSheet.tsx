import { Text } from '@seed-design/react'
import { useActivityZIndexBase } from '@seed-design/stackflow'
import { BottomSheetBody, BottomSheetContent } from 'seed-design/ui/bottom-sheet'
import { List, ListButtonItem } from 'seed-design/ui/list'
import type { SavingsTerm } from '../api'
import { calculateTermMaturity } from '../savings'
import { formatAnnualRate, formatWon } from '../utils/format'

type TermCompareSheetProps = {
  terms: SavingsTerm[]
  monthlyAmount: number
  selectedMonths: number
  autoTransfer: boolean
  onSelect: (months: number) => void
}

export function TermCompareSheet({ terms, monthlyAmount, selectedMonths, autoTransfer, onSelect }: TermCompareSheetProps) {
  // 시트가 이 화면 위에 그려지도록 화면의 층 번호를 넘긴다. SEED가 Stackflow 화면 안 시트에 쓰는 방식이다.
  const layerIndex = useActivityZIndexBase()

  return (
    <BottomSheetContent
      title="기간별로 비교해 보세요"
      description={`매달 ${formatWon(monthlyAmount)}씩 넣으면 만기에 이만큼 받아요.`}
      layerIndex={layerIndex}
    >
      <BottomSheetBody>
        <List>
          {terms.map((term) => {
            const { appliedRate, maturityAmount } = calculateTermMaturity(monthlyAmount, term, autoTransfer)
            const formattedAnnualRate = formatAnnualRate(appliedRate)
            return (
              <ListButtonItem
                key={term.months}
                title={`${term.months}개월`}
                detail={term.months === selectedMonths ? `연 ${formattedAnnualRate} · 지금 고른 기간` : `연 ${formattedAnnualRate}`}
                suffix={<Text textStyle="t5Bold">{formatWon(maturityAmount)}</Text>}
                onClick={() => onSelect(term.months)}
              />
            )
          })}
        </List>
      </BottomSheetBody>
    </BottomSheetContent>
  )
}
