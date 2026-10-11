import { RadioGroup, RadioGroupItem } from 'seed-design/ui/radio-group'
import { INITIAL_RESERVATIONS, isReservationId, ReservationId } from './reservation'

interface Props {
  selectedId: ReservationId
  disabled: boolean
  onReservationChange: (value: ReservationId) => void
}

export function ReservationSelector({ selectedId, disabled, onReservationChange }: Props) {
  const handleValueChange = (value: string) => {
    if (!isReservationId(value)) {
      return
    }

    onReservationChange(value)
  }

  return (
    <RadioGroup label="내 예약" value={selectedId} disabled={disabled} onValueChange={handleValueChange}>
      {INITIAL_RESERVATIONS.map((item) => (
        <RadioGroupItem key={item.id} value={item.id} label={item.title} size="large" tone="neutral" className="reservation-choice" />
      ))}
    </RadioGroup>
  )
}
