import { formatPrice } from '../../utils/formatPrice'

/* 배송 주문의 최소 금액 */
const DELIVERY_MINIMUM_ORDER_AMOUNT = 10_000
/* 배송비 */
const SHIPPING_FEE = 3_000
/* 무료 배송의 최소 금액 */
const FREE_SHIPPING_MINIMUM_AMOUNT = 30_000

/* 최소 주문 금액을 충족하는지 판별하는 함수 */
function meetsMinimumAmount(subtotalPrice: number) {
  return subtotalPrice >= DELIVERY_MINIMUM_ORDER_AMOUNT
}

/* 무료 배송 기준을 충족하는지 판별하는 함수 */
function qualifiesForFreeShipping(subtotalPrice: number) {
  return subtotalPrice >= FREE_SHIPPING_MINIMUM_AMOUNT
}

/* 배송 정책에 따른 배송비를 계산하는 함수 */
export function calculateDeliveryShippingFee(subtotalPrice: number) {
  return qualifiesForFreeShipping(subtotalPrice) ? 0 : SHIPPING_FEE
}

/* 배송 주문의 유효성 검증하는 함수 */
export function validateDeliveryOrder({ subtotalPrice, address }: { subtotalPrice: number; address: string }) {
  if (!meetsMinimumAmount(subtotalPrice)) {
    return `배송 주문은 상품 금액 ${formatPrice(DELIVERY_MINIMUM_ORDER_AMOUNT)}부터 가능해요.`
  }

  if (!address.trim()) {
    return '배송 주소를 입력해 주세요.'
  }

  return null
}
