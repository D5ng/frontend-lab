const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

// 알림을 받은 때를 "3분 전"처럼 보여 준다. 기준 시각은 서버 응답의 now를 넘긴다.
export function formatTimeAgo(createdAt: string, now: string) {
  const elapsed = new Date(now).getTime() - new Date(createdAt).getTime()
  if (elapsed < MINUTE) return '방금 전'
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}분 전`
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}시간 전`
  const days = Math.floor(elapsed / DAY)
  return days === 1 ? '어제' : `${days}일 전`
}
