import { fetchRooms, type RoomListResponse } from '../../../room/api'
import { toRoom } from '../../../room/toRoom'
import { useHttpRequest } from '../../../shared/hooks/useHttpRequest'

export function useRooms() {
  const { data, isLoading, hasError, reload } = useHttpRequest<RoomListResponse | null>(fetchRooms)

  return {
    data: data?.rooms.map(toRoom) ?? [],
    isLoading,
    hasError,
    reload,
  }
}
