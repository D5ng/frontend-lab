import type { Space } from './types'
export const spaces: Space[] = [
  {
    id: 'studio',
    name: '햇살 스튜디오',
    capacity: 6,
    hourlyPrice: 19000,
    projector: true,
    hours: { today: [9, 10, 11, 13, 14, 15, 16, 17], tomorrow: [9, 10, 11, 12, 13, 14, 15, 16, 17] },
  },
  {
    id: 'lounge',
    name: '작은 라운지',
    capacity: 4,
    hourlyPrice: 12000,
    projector: false,
    hours: { today: [9, 10, 13, 14, 16, 17], tomorrow: [9, 10, 11, 12, 13, 14, 15, 16, 17] },
  },
  {
    id: 'hall',
    name: '함께 모임방',
    capacity: 10,
    hourlyPrice: 25000,
    projector: true,
    hours: { today: [13, 14, 15, 16, 17], tomorrow: [9, 10, 11, 12, 13, 14, 15, 16, 17] },
  },
]
