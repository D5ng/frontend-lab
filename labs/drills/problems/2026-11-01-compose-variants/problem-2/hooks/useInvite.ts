import { useState } from 'react'
import { answerInvite, type InviteNotification, type InviteStatus } from '../api'

type Answer = 'accept' | 'decline'

export function useInvite(notification: InviteNotification) {
  const [status, setStatus] = useState<InviteStatus>(notification.status)
  const [answering, setAnswering] = useState<Answer | null>(null)
  const [error, setError] = useState(false)

  const respondToInvite = async (answer: Answer) => {
    setAnswering(answer)
    setError(false)

    try {
      const result = await answerInvite(notification.id, answer === 'accept')
      setStatus(result.status)
    } catch {
      setError(true)
    } finally {
      setAnswering(null)
    }
  }

  return {
    status,
    answering,
    error,
    respondToInvite,
  }
}
