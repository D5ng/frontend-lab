import type { RoomDetailResponse, RoomSummaryResponse } from './api'
import { calculatePyeong, type DetailRoom, type Room } from './room'

export function toRoom(response: RoomSummaryResponse): Room {
  const { room_id, title, deposit, monthly_rent, maintenance_fee, area_m2, floor, available_from } = response
  const [currentFloor, totalFloor] = floor.split('/')
  const monthlyCost = maintenance_fee === null ? null : monthly_rent + maintenance_fee
  const pyeong = calculatePyeong(area_m2)

  return {
    id: room_id,
    title,
    deposit,
    monthlyRent: monthly_rent,
    maintenanceFee: maintenance_fee,
    areaM2: area_m2,
    floor: currentFloor,
    totalFloor,
    availableFrom: available_from,
    monthlyCost,
    pyeong,
  }
}

export function toDetailRoom(response: RoomDetailResponse): DetailRoom {
  return {
    ...toRoom(response),
    description: response.description,
    options: response.options,
  }
}
