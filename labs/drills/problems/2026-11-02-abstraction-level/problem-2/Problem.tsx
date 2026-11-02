import { seedPlugin } from '@seed-design/stackflow'
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic'
import { stackflow } from '@stackflow/react'
import { SnackbarProvider } from 'seed-design/ui/snackbar'
import { ClassDetail } from './ClassDetail'

const { Stack } = stackflow({
  activities: { ClassDetail },
  initialActivity: () => 'ClassDetail',
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
