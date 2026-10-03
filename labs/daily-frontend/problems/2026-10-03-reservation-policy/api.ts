export type CancellationRequest = {
  reservationId: string
  reason: string
  fee: number
  refund: number
}

export type CancelReservation = (request: CancellationRequest) => Promise<void>

// 요청 계약과 브라우저 검수용 모의 서버입니다. 취소 정책은 서버가 계산하지 않습니다.
export function createDemoCancellation(): CancelReservation {
  let calls = 0
  return async () => {
    calls += 1
    const attempt = calls
    await new Promise<void>((resolve) => setTimeout(resolve, 900))
    if (attempt === 1) throw new Error('temporary failure')
  }
}
