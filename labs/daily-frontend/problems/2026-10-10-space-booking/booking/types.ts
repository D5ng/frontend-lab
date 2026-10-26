export type Day = 'today' | 'tomorrow'
export interface Space {
  id: string
  name: string
  capacity: number
  hourlyPrice: number
  projector: boolean
  hours: Record<Day, number[]>
}
export interface BookingDraft {
  day: Day
  start: string
  duration: string
  guests: string
  projector: boolean
  spaceId: string
}
export interface Quote {
  spaceName: string
  base: number
  equipment: number
  total: number
  timeLabel: string
}
export interface BookingRequest {
  day: Day
  startHour: number
  duration: number
  guests: number
  projector: boolean
  spaceId: string
  totalPrice: number
}
export interface BookingApi {
  getSpaces: () => Promise<Space[]>
  reserve: (input: BookingRequest) => Promise<{ id: string }>
}
