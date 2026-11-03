import type { Room } from '../../../room/room'

export type SortOrder = 'latest' | 'monthlyCost'

export function sortRooms(rooms: Room[], sortOrder: SortOrder) {
  return sortOrder === 'monthlyCost' ? [...rooms].sort((a, b) => a.monthlyCost - b.monthlyCost) : rooms
}
