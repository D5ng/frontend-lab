import { RadioGroup, RadioGroupItem } from 'seed-design/ui/radio-group'
import { INITIAL_RESERVATIONS, ReservationId } from '../models/reservation'

interface Props {
  selectedId: ReservationId
  disabled: boolean
  onReservationChange: (value: string) => void
}

export function ReservationSelector({ selectedId, disabled, onReservationChange }: Props) {
  return (
    <RadioGroup label="내 예약" value={selectedId} disabled={disabled} onValueChange={onReservationChange}>
      {INITIAL_RESERVATIONS.map((item) => (
        <RadioGroupItem key={item.id} value={item.id} label={item.title} size="large" tone="neutral" className="reservation-choice" />
      ))}
    </RadioGroup>
  )
}
