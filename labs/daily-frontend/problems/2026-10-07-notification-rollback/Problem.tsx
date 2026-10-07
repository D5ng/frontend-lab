import { useState } from 'react'
import { createNotificationMock } from './api'
import { NotificationSettings } from './starter'

export function Problem() {
  const [updateNotification] = useState(() => createNotificationMock())
  return <NotificationSettings updateNotification={updateNotification} />
}
