import type { Day, Slot } from '../types/pickup'

export const slotsByDay: Record<Day, Slot[]> = {
  today: [
    { id: 'today-18', label: '오후 6시' },
    { id: 'today-19', label: '오후 7시' },
  ],
  tomorrow: [
    { id: 'tomorrow-10', label: '오전 10시' },
    { id: 'tomorrow-11', label: '오전 11시' },
  ],
}
