import { seedPlugin } from '@seed-design/stackflow'
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic'
import { stackflow } from '@stackflow/react'
import { SalonDone } from './screens/SalonDone'
import { SalonHome } from './screens/SalonHome'
import { SalonSchedule } from './screens/SalonSchedule'
import { SalonServices } from './screens/SalonServices'

const { Stack } = stackflow({
  activities: { SalonHome, SalonServices, SalonSchedule, SalonDone },
  // 다른 화면을 미리 보려면 여기를 잠깐 바꿔 보세요. 화면 사이 이동은 연결되어 있지 않습니다.
  initialActivity: () => 'SalonHome',
  transitionDuration: 350,
  plugins: [basicRendererPlugin(), seedPlugin({ theme: 'cupertino' })],
})

export function App() {
  return <Stack />
}
