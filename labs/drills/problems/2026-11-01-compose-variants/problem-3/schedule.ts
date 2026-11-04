const KOREA_OFFSET = 9 * 60 * 60 * 1000
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

// 모임 일정을 한국 시각으로 "11월 6일 (금) 오후 7:30"처럼 보여 준다.
// 실행하는 곳의 시간대나 언어 설정에 따라 글자가 달라지지 않게 직접 만든다.
export function formatSchedule(iso: string) {
  const date = new Date(new Date(iso).getTime() + KOREA_OFFSET)
  const hour = date.getUTCHours()
  const period = hour < 12 ? '오전' : '오후'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  const minute = String(date.getUTCMinutes()).padStart(2, '0')
  return `${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일 (${WEEKDAYS[date.getUTCDay()]}) ${period} ${displayHour}:${minute}`
}
