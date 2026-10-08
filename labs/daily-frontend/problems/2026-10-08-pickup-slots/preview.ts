import { slotsByDay } from './api'
import type { PickupViewProps } from './view'

const base: PickupViewProps = {
  day: 'today',
  slots: slotsByDay.today,
  selectedSlotId: '',
  loading: false,
  loadError: false,
  reserving: false,
  reserveMessage: '',
  reserveError: false,
  onDayChange() {},
  onSlotChange() {},
  onReload() {},
  onReserve() {},
}
export const previews: Record<string, PickupViewProps> = {
  ready: base,
  selected: { ...base, selectedSlotId: 'today-18' },
  loading: { ...base, day: 'tomorrow', slots: [], loading: true },
  empty: { ...base, slots: [] },
  error: { ...base, slots: [], loadError: true },
  reserving: { ...base, selectedSlotId: 'today-18', reserving: true },
  failed: {
    ...base,
    selectedSlotId: 'today-18',
    reserveError: true,
    reserveMessage: '예약하지 못했어요. 선택한 시간으로 다시 시도해 주세요.',
  },
  success: { ...base, selectedSlotId: 'today-18', reserveMessage: '오늘 오후 6시 픽업을 예약했어요.' },
}
