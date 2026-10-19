import { useState } from 'react'
import { createReadMock } from './features/notificationInbox/apis/createReadMock'
import { NotificationInboxPage } from './pages/NotificationInboxPage'

export function Problem() {
  const [markRead] = useState(createReadMock)
  return <NotificationInboxPage markRead={markRead} />
}
