export interface Room {
  id: number
  title: string
  deposit: number
  monthlyRent: number
  maintenanceFee: number | null
  areaM2: number
  floor: string
  totalFloor: string
  availableFrom: string | null
  monthlyCost: number | null
  pyeong: number
}

export type DetailRoom = Room & {
  description: string
  options: string[]
}

const SQUARE_METERS_PER_PYEONG = 3.3058

export function calculatePyeong(area: number) {
  return Math.round(area / SQUARE_METERS_PER_PYEONG)
}
