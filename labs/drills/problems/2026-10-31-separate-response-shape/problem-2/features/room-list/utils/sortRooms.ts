import type { Room } from '../../../room/room'

export type SortOrder = 'latest' | 'monthlyCost'

export function sortRooms(rooms: Room[], sortOrder: SortOrder) {
  // 매달 드는 돈 적은 순, 단 관리비가 null이라면 맨 뒤로,
  if (sortOrder === 'latest') {
    return rooms
  }

  const unknownCostRooms = rooms.filter((room) => room.monthlyCost === null)
  const knownCostRooms = rooms.filter((room): room is Room & { monthlyCost: number } => room.monthlyCost !== null)

  return [...knownCostRooms.sort((a, b) => a.monthlyCost - b.monthlyCost), ...unknownCostRooms]
}
