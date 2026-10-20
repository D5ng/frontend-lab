import { type SubmitEventHandler, useState } from 'react'
import type { CancelReservation } from '../../../api'
import { getCancelFee, getRefundAmount, isCancellable, isCancelReasonTooShort, MIN_CANCEL_REASON_LENGTH } from '../models/cancelPolicy'
import { INITIAL_RESERVATIONS, isReservationId, type Reservation, type ReservationId } from '../models/reservation'

export interface CancelReservationResult {
  tone: 'critical' | 'positive'
  message: string
}

interface Params {
  cancelledIds: ReservationId[]
  cancelReservation: CancelReservation
  onCancelled: (reservation: Reservation) => void
}

export function useCancelReservationForm({ cancelledIds, cancelReservation, onCancelled }: Params) {
  const [selectedId, setSelectedId] = useState<ReservationId>('tomorrow')
  const [reason, setReason] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<CancelReservationResult | null>(null)

  const selected = INITIAL_RESERVATIONS.find((item) => item.id === selectedId) ?? INITIAL_RESERVATIONS[0]
  const submitDisabled = pending || !isCancellable(cancelledIds, selected)

  const handleReservationChange = (value: string) => {
    if (!isReservationId(value)) {
      return
    }

    setSelectedId(value)
    reset()
  }

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

    if (submitDisabled) {
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
        reservationId: selected.id,
        reason: reason.trim(),
        fee: getCancelFee(selected.timing),
        refund: getRefundAmount(selected),
      })
      onCancelled(selected)
      setReason('')
      setResult({ tone: 'positive', message: '예약을 취소했어요. 환불 예정 금액을 확인해 주세요.' })
    } catch {
      setResult({ tone: 'critical', message: '취소하지 못했어요. 입력한 사유를 확인하고 다시 시도해 주세요.' })
    } finally {
      setPending(false)
    }
  }

  return {
    selected,
    selectedId,
    fieldError,
    reason,
    result,
    submitDisabled,
    pending,
    handleReservationChange,
    handleReasonChange,
    handleSubmit,
  }
}
