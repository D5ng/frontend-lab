import { useState } from 'react'
import { createReadMock } from './api'
import { NotificationInbox } from './starter'

export function Problem() {
  const [markRead] = useState(createReadMock)
  return <NotificationInbox markRead={markRead} />
}
