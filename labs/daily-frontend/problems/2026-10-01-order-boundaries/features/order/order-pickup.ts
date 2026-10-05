import { PickupDate } from './order.model'

/* 오늘 픽업 가능한 최대 수량 */
export const TODAY_PICKUP_MAX_QUANTITY = 3

/* 오늘의 수량 제한을 초과하는지 판별하는 함수 */
export function exceedsTodayQuantityLimit(pickupDate: PickupDate, quantity: number) {
  return pickupDate === 'today' && quantity > TODAY_PICKUP_MAX_QUANTITY
}

/* 픽업 매장 유효성 검증하는 함수 */
export function validatePickupOrder({ store, pickupDate, quantity }: { store: string; pickupDate: PickupDate; quantity: number }) {
  if (!store) {
    return '픽업 매장을 선택해 주세요.'
  }
  if (exceedsTodayQuantityLimit(pickupDate, quantity)) {
    return `오늘 픽업은 ${TODAY_PICKUP_MAX_QUANTITY}개까지 가능해요. 내일을 선택해 주세요.`
  }

  return null
}
