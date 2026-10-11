/* 금액을 천 단위로 구분하고 "원"을 붙이는 함수 */
export function formatPrice(value: number) {
  return `${value.toLocaleString('ko-KR')}원`
}
