export function formatWithComma(value: number) {
  return value.toLocaleString('ko-KR')
}

export function formatManwon(value: number) {
  return `${formatWithComma(value)}만원`
}

export function formatMonthDay(date: string) {
  const [, month, day] = date.split('-')

  return `${Number(month)}월 ${Number(day)}일`
}
