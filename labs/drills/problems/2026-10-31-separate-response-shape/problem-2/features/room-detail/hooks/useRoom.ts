import { useCallback } from 'react'
import { fetchRoom, type RoomDetailResponse } from '../../../room/api'
import { toDetailRoom } from '../../../room/toRoom'
import { useHttpRequest } from '../../../shared/hooks/useHttpRequest'

interface Params {
  roomId: number
}

export function useRoom({ roomId }: Params) {
  const requestCallback = useCallback(() => fetchRoom(roomId), [roomId])
  const { data, hasError, reload } = useHttpRequest<RoomDetailResponse | null>(requestCallback)

  return {
    data: data ? toDetailRoom(data) : null,
    hasError,
    reload,
  }
}
