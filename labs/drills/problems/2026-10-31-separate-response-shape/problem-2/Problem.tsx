import { seedPlugin } from '@seed-design/stackflow'
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic'
import { stackflow } from '@stackflow/react'
import { SnackbarProvider } from 'seed-design/ui/snackbar'
import { RoomDetail } from './features/room-detail'
import { RoomList } from './features/room-list'

const { Stack } = stackflow({
  activities: { RoomList, RoomDetail },
  initialActivity: () => 'RoomList',
  transitionDuration: 350,
  plugins: [basicRendererPlugin(), seedPlugin({ theme: 'cupertino' })],
})

export function Problem() {
  return (
    <SnackbarProvider>
      <Stack />
    </SnackbarProvider>
  )
}
