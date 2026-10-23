export type Destination = 'park' | 'museum' | 'pier'

export interface Route {
  id: string
  title: string
  minutes: number
  transfers: number
}

export type LoadRoutes = (destination: Destination) => Promise<Route[]>
