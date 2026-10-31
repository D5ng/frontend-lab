export function formatNumber(value: number) {
  return value.toLocaleString('ko-KR')
}

export function formatWon(value: number) {
  return `${formatNumber(value)}원`
}

export function formatAnnualRate(value: number) {
  return `${value.toFixed(1)}%`
}
