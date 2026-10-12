import { formatPrice } from '../../../utils/formatPrice'
import { Reservation, ReservationId, ReservationTiming } from './reservation'

/* 당일 취소 수수료 */
const SAME_DAY_CANCEL_FEE = 2_000

/* 당일 취소 수수료를 가져오는 함수 */
export function getCancelFee(timing: ReservationTiming) {
  return timing === 'same-day' ? SAME_DAY_CANCEL_FEE : 0
}

interface CancelNotice {
  tone: 'neutral' | 'warning'
  message: string
}

export const CANCEL_POLICY_NOTICE_BY_TIMING: Record<ReservationTiming, CancelNotice> = {
  'before-day': {
    tone: 'neutral',
    message: '시작 전날까지는 전액 환불돼요.',
  },
  'same-day': {
    tone: 'neutral',
    message: `당일 취소는 수수료 ${formatPrice(SAME_DAY_CANCEL_FEE)}이 차감돼요.`,
  },
  started: {
    tone: 'warning',
    message: '시작한 클래스는 취소할 수 없어요.',
  },
}

const ALREADY_CANCELLED_NOTICE: CancelNotice = {
  tone: 'neutral',
  message: '이미 취소한 예약이에요.',
}

/* 예약 취소 정책 문구를 반환하는 함수 */
export function getCancelNotice(cancelledIds: ReservationId[], reservation: Reservation) {
  return isAlreadyCancelled(cancelledIds, reservation) ? ALREADY_CANCELLED_NOTICE : CANCEL_POLICY_NOTICE_BY_TIMING[reservation.timing]
}

/* 환불 예정 금액을 반환하는 함수 */
export function getRefundAmount(reservation: Reservation) {
  return reservation.paid - getCancelFee(reservation.timing)
}

export const MIN_CANCEL_REASON_LENGTH = 5

/* 예약 취소 사유의 글자수가 기준보다 짧은지 판별하는 함수 */
export function isCancelReasonTooShort(reason: string) {
  return reason.trim().length < MIN_CANCEL_REASON_LENGTH
}

/* 취소 가능한 시점인지 판별하는 함수 */
export function isCancellableTiming(timing: ReservationTiming): boolean {
  return timing !== 'started'
}

/* 취소 가능한 예약인지 판별하는 함수 */
export function isCancellable(cancelledIds: ReservationId[], selected: Reservation) {
  return !isAlreadyCancelled(cancelledIds, selected) && isCancellableTiming(selected.timing)
}

/* 이미 취소된 예약인지 판별하는 함수 */
export function isAlreadyCancelled(cancelledIds: ReservationId[], reservation: Reservation) {
  return cancelledIds.includes(reservation.id)
}
