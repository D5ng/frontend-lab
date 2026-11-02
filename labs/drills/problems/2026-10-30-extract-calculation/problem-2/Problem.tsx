import { seedPlugin } from '@seed-design/stackflow'
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic'
import { stackflow } from '@stackflow/react'
import { SavingsConfirm } from './components/SavingsConfirm'
import { SavingsDone } from './components/SavingsDone'
import { SavingsHome } from './components/SavingsHome'

const { Stack } = stackflow({
  activities: { SavingsHome, SavingsConfirm, SavingsDone },
  initialActivity: () => 'SavingsHome',
  transitionDuration: 350,
  plugins: [basicRendererPlugin(), seedPlugin({ theme: 'cupertino' })],
})

export function Problem() {
  return <Stack />
}
