export interface Place {
  id: string
  name: string
  duration: number
  fee: number
  opens: number
  closes: number
}
export interface TripRequest {
  startHour: number
  budget: number
  placeIds: string[]
}
export interface TripApi {
  getPlaces: () => Promise<Place[]>
  save: (input: TripRequest) => Promise<{ id: string }>
}
