import type { MarkRead } from '../types/notification'

export function createReadMock(): MarkRead {
  let attempt = 0
  return async () => {
    const currentAttempt = ++attempt
    await new Promise<void>((resolve) => setTimeout(resolve, 1800))
    if (currentAttempt === 1) throw new Error('읽음 처리 실패')
  }
}
