import { useState } from 'react'
import { requestVisit } from '../../../room/api'

interface Params {
  id: number
  onSuccess: () => void
  onError: () => void
}

export function useVisitRequest({ id, onSuccess, onError }: Params) {
  const [visitStatus, setVisitStatus] = useState<'idle' | 'pending' | 'done'>('idle')

  const handleRequestVisit = async () => {
    setVisitStatus('pending')
    try {
      await requestVisit(id)
      setVisitStatus('done')
      onSuccess()
    } catch {
      setVisitStatus('idle')
      onError()
    }
  }

  return {
    visitStatus,
    handleRequestVisit,
  }
}
