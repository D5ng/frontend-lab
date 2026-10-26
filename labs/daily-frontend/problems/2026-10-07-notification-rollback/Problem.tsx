import { useState } from 'react'
import { createNotificationMock } from './features/notificationSettings/apis/createNotificationMock'
import { NotificationSettingsPage } from './pages/NotificationSettingsPage'

export function Problem() {
  const [api] = useState(() => createNotificationMock())
  return <NotificationSettingsPage api={api} />
}
