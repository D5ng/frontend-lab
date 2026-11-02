export type Instructor = {
  name: string
  intro: string
  profileImageUrl: string | null
}

export type GymClass = {
  id: string
  name: string
  studioName: string
  room: string
  startsAt: string
  durationMinutes: number
  instructor: Instructor
  capacity: number
  bookedCount: number
  waitlistCount: number
  cancelDeadlineHours: number
  myBooking: { passId: string } | null
}

export type ClassPass = {
  id: string
  name: string
  remainingCount: number
  expiresAt: string
}

export type ClassDetailResponse = {
  gymClass: GymClass
  passes: ClassPass[]
}

const BASE = '/api/drills/2026-11-02'

export async function fetchClassDetail(classId: string): Promise<ClassDetailResponse> {
  const response = await fetch(new URL(`${BASE}/classes/${classId}`, window.location.origin))
  if (!response.ok) throw new Error('수업 정보를 불러오지 못했어요.')
  return (await response.json()) as ClassDetailResponse
}

export async function bookClass(classId: string, passId: string): Promise<ClassDetailResponse> {
  const response = await fetch(new URL(`${BASE}/classes/${classId}/bookings`, window.location.origin), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passId }),
  })
  if (!response.ok) throw new Error('예약하지 못했어요.')
  return (await response.json()) as ClassDetailResponse
}
