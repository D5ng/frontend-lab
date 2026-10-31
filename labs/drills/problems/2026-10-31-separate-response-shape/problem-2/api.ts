// 금액은 모두 만원 단위다. floor는 "지금 층/건물 층수", available_from이 null이면 바로 들어갈 수 있다.
export type RoomSummaryResponse = {
  room_id: number
  title: string
  deposit: number
  monthly_rent: number
  maintenance_fee: number
  area_m2: number
  floor: string
  available_from: string | null
}

export type RoomListResponse = {
  rooms: RoomSummaryResponse[]
  total_count: number
}

export type RoomDetailResponse = RoomSummaryResponse & {
  description: string
  options: string[]
}

const BASE = '/api/drills/2026-10-31/rooms'

export async function fetchRooms(): Promise<RoomListResponse> {
  const response = await fetch(new URL(BASE, window.location.origin))
  if (!response.ok) throw new Error('방 목록을 불러오지 못했어요.')
  return (await response.json()) as RoomListResponse
}

export async function fetchRoom(roomId: number): Promise<RoomDetailResponse> {
  const response = await fetch(new URL(`${BASE}/${roomId}`, window.location.origin))
  if (!response.ok) throw new Error('방 정보를 불러오지 못했어요.')
  return (await response.json()) as RoomDetailResponse
}

export async function requestVisit(roomId: number): Promise<void> {
  const response = await fetch(new URL(`${BASE}/${roomId}/visit-requests`, window.location.origin), { method: 'POST' })
  if (!response.ok) throw new Error('방 보기를 요청하지 못했어요.')
}
