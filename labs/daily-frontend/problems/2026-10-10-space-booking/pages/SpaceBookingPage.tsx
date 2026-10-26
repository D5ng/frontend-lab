import { bookingStarter } from '../booking/preview'
import { SpaceBookingView } from '../booking/SpaceBookingView'
import type { BookingApi } from '../booking/types'
export function SpaceBookingPage({ api }: { api: BookingApi }) {
  // TODO: 목록 조회·조건 변경·예약 가능성 판단·견적·예약을 직접 구현하세요.
  void api
  return <SpaceBookingView {...bookingStarter} />
}
