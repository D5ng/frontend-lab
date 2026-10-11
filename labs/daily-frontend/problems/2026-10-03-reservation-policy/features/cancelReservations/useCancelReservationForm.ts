import { SubmitEventHandler, useState } from 'react'
import { CancelReservation } from '../../api'
import { getCancelFee, getRefundAmount, isCancelReasonTooShort, MIN_CANCEL_REASON_LENGTH } from './cancelPolicy'
import { Reservation } from './reservation'

export interface CancelReservationResult {
  tone: 'critical' | 'positive'
  message: string
}

interface Params {
  reservation: Reservation
  cancellable: boolean
  cancelReservation: CancelReservation
  onCancelled: (reservation: Reservation) => void
}

export function useCancelReservationForm({ reservation, cancellable, cancelReservation, onCancelled }: Params) {
  const [reason, setReason] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<CancelReservationResult | null>(null)

  const disabled = pending || !cancellable

  const clearFeedback = () => {
    setFieldError('')
    setResult(null)
  }

  const reset = () => {
    setReason('')
    clearFeedback()
  }

  const handleReasonChange = (reason: string) => {
    setReason(reason)
    clearFeedback()
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    if (disabled) {
      return
    }

    clearFeedback()

    if (isCancelReasonTooShort(reason)) {
      setFieldError(`취소 사유를 ${MIN_CANCEL_REASON_LENGTH}자 이상 입력해 주세요.`)
      return
    }

    setPending(true)

    try {
      await cancelReservation({
        reservationId: reservation.id,
        reason: reason.trim(),
        fee: getCancelFee(reservation.timing),
        refund: getRefundAmount(reservation),
      })
      onCancelled(reservation)
      setReason('')
      setResult({ tone: 'positive', message: '예약을 취소했어요. 환불 예정 금액을 확인해 주세요.' })
    } catch {
      setResult({ tone: 'critical', message: '취소하지 못했어요. 입력한 사유를 확인하고 다시 시도해 주세요.' })
    } finally {
      setPending(false)
    }
  }

  return {
    fieldError,
    reason,
    result,
    disabled,
    pending,
    reset,
    handleReasonChange,
    handleSubmit,
  }
}
