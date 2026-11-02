# 공연 예매 내역, 두 가지 구현

- 역할: 리마인드 · 15~20분
- 유형: 비교 판단. 코드는 고치지 않고, 주어진 변경에 어느 쪽이 강한지와 근거를 씁니다.
- 도메인: 티켓·공연 (예매 내역)
- 화면 없음

## 상황

공연 예매 앱의 "내 예매" 기능입니다. 예매 목록, 예매 상세, 취소 화면 세 곳이 아래 함수를 씁니다.

- 공연 일시는 `11월 15일 19:30`처럼 보여 줍니다.
- 공연 시작 24시간 전까지만 취소할 수 있습니다.
- "다가오는 공연"에는 예매한 상태이면서 아직 시작하지 않은 공연만 보여 줍니다.

서버 응답은 이렇습니다.

```ts
type BookingResponse = {
  booking_no: string
  show_name: string
  show_date: string // '20261115'
  show_time: string // '1930'
  status_cd: 'BK' | 'CC' | 'VW' // 예매함, 취소함, 관람함
}
```

두 사람이 같은 기능을 따로 만들었습니다. 둘 다 지금은 똑같이 동작합니다.

### A: 응답을 그대로 쓴다

```ts
import type { BookingResponse } from './api'

const DAY = 24 * 60 * 60 * 1000

export function getShowLabel(booking: BookingResponse) {
  const month = Number(booking.show_date.slice(4, 6))
  const day = Number(booking.show_date.slice(6, 8))
  return `${month}월 ${day}일 ${booking.show_time.slice(0, 2)}:${booking.show_time.slice(2)}`
}

export function canCancel(booking: BookingResponse, now: Date) {
  if (booking.status_cd !== 'BK') return false
  const d = booking.show_date
  const showAt = new Date(
    `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T${booking.show_time.slice(0, 2)}:${booking.show_time.slice(2)}:00+09:00`,
  )
  return showAt.getTime() - now.getTime() > DAY
}

export function getUpcoming(bookings: BookingResponse[], now: Date) {
  return bookings.filter((booking) => {
    const d = booking.show_date
    const showAt = new Date(
      `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T${booking.show_time.slice(0, 2)}:${booking.show_time.slice(2)}:00+09:00`,
    )
    return booking.status_cd === 'BK' && showAt > now
  })
}
```

화면은 `booking.show_name`, `booking.status_cd`를 그대로 읽습니다.

### B: 받자마자 바꾼다

```ts
import type { BookingResponse } from './api'

export type Booking = {
  bookingNo: string
  showName: string
  showAt: Date
  status: 'booked' | 'canceled' | 'watched'
}

const STATUS: Record<BookingResponse['status_cd'], Booking['status']> = { BK: 'booked', CC: 'canceled', VW: 'watched' }

export function toBooking(response: BookingResponse): Booking {
  const d = response.show_date
  const t = response.show_time
  return {
    bookingNo: response.booking_no,
    showName: response.show_name,
    showAt: new Date(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T${t.slice(0, 2)}:${t.slice(2)}:00+09:00`),
    status: STATUS[response.status_cd],
  }
}

const DAY = 24 * 60 * 60 * 1000

export function getShowLabel(booking: Booking) {
  return booking.showAt.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
}

export function canCancel(booking: Booking, now: Date) {
  return booking.status === 'booked' && booking.showAt.getTime() - now.getTime() > DAY
}

export function getUpcoming(bookings: Booking[], now: Date) {
  return bookings.filter((booking) => booking.status === 'booked' && booking.showAt > now)
}
```

예매 목록을 불러오는 함수가 응답을 받자마자 `toBooking`으로 바꿔서 돌려주고, 화면은 `Booking`만 압니다.

## 변경 두 가지

1. **서버 변경**: 서버 팀이 공연 일시를 두 칸에서 한 칸으로 합칩니다. `show_date: '20261115'`, `show_time: '1930'`이 사라지고 `show_at: '2026-11-15T19:30:00+09:00'`이 생깁니다.
2. **화면 요청**: 예매 목록 카드에 공연장 이름을 보여 달라고 합니다. 서버는 이미 `venue_name: '한빛아트홀'`을 보내고 있었고, 지금까지 아무도 안 썼습니다.

## 할 일

`note.md`의 질문에 답합니다. 변경마다 A와 B에서 고칠 곳을 함수나 타입 이름으로 세어 보고, 어느 쪽이 덜 고치는지 적습니다. 코드는 고치지 않습니다.
