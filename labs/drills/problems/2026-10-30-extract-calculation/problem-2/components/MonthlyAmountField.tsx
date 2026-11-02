import { TextField, TextFieldInput } from 'seed-design/ui/text-field'
import { formatWon } from '../utils/format'

interface Props {
  amountText: string
  isOutOfRange: boolean
  minMonthlyAmount: number
  maxMonthlyAmount: number
  onAmountChange: (text: string) => void
}

export function MonthlyAmountField({ amountText, isOutOfRange, minMonthlyAmount, maxMonthlyAmount, onAmountChange }: Props) {
  return (
    <TextField
      label="매달 넣을 금액"
      suffix="원"
      value={amountText}
      onValueChange={({ value }) => onAmountChange(value)}
      invalid={isOutOfRange}
      description={`한 달에 ${formatWon(minMonthlyAmount)}부터 ${formatWon(maxMonthlyAmount)}까지 넣을 수 있어요.`}
      errorMessage={`${formatWon(minMonthlyAmount)}부터 ${formatWon(maxMonthlyAmount)} 사이로 넣어 주세요.`}
    >
      <TextFieldInput inputMode="numeric" placeholder="300000" />
    </TextField>
  )
}
