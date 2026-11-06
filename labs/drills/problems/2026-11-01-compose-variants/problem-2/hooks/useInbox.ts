import { useEffect, useState } from 'react'
import { fetchInbox, type InboxResponse } from '../api'

type InboxState = { status: 'pending' } | { status: 'error' } | { status: 'success'; data: InboxResponse }

export function useInbox() {
  const [inboxState, setInboxState] = useState<InboxState>({ status: 'pending' })
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      setInboxState({ status: 'pending' })
      try {
        const data = await fetchInbox()
        setInboxState({ status: 'success', data })
      } catch {
        setInboxState({ status: 'error' })
      }
    }

    load()
  }, [reloadCount])

  const reload = () => {
    setInboxState({ status: 'pending' })
    setReloadCount((prevCount) => prevCount + 1)
  }

  return {
    inboxState,
    reload,
  }
}
