// 풀이 대상이 아니다. 실행하는 컴퓨터의 시간대와 상관없이 서울 시각으로 쓴다.
const SEOUL_OFFSET_MS = 9 * 60 * 60 * 1000
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function toSeoul(iso: string) {
  const date = new Date(new Date(iso).getTime() + SEOUL_OFFSET_MS)
  return {
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    weekday: WEEKDAYS[date.getUTCDay()],
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
  }
}

/** `11월 4일 (수) 오후 7:00` */
export function formatDateTime(iso: string) {
  const { month, day, weekday, hours, minutes } = toSeoul(iso)
  const period = hours < 12 ? '오전' : '오후'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${month}월 ${day}일 (${weekday}) ${period} ${hour12}:${String(minutes).padStart(2, '0')}`
}

/** `12월 31일` */
export function formatMonthDay(iso: string) {
  const { month, day } = toSeoul(iso)
  return `${month}월 ${day}일`
}
