import type { LoadSlots, ReserveSlot } from './api'
import { PickupView } from './view'

export type PickupPlannerProps = { loadSlots: LoadSlots; reserveSlot: ReserveSlot }

export function PickupPlanner(props: PickupPlannerProps) {
  // TODO: 조회·날짜 변경·시간 선택·예약의 상태와 로직을 직접 설계하세요.
  // props의 두 API를 사용합니다. 제공 화면의 props를 모두 state로 만들 필요는 없습니다.
  void props
  return (
    <PickupView
      day="today"
      slots={[]}
      selectedSlotId=""
      loading={false}
      loadError={false}
      reserving={false}
      reserveMessage=""
      reserveError={false}
      starter
      onDayChange={() => {}}
      onSlotChange={() => {}}
      onReload={() => {}}
      onReserve={() => {}}
    />
  )
}
