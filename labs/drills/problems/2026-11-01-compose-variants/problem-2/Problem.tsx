import { seedPlugin } from '@seed-design/stackflow'
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic'
import { type ActivityComponentType, stackflow } from '@stackflow/react'
import { AppBar, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'

// 화면 틀만 있다. 알림 목록은 problem.md를 보고 처음부터 만든다. 파일을 나눌지도 직접 정한다.
const InboxHome: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarMain title="알림" />
      </AppBar>
      <AppScreenContent>{null}</AppScreenContent>
    </AppScreen>
  )
}

const { Stack } = stackflow({
  activities: { InboxHome },
  initialActivity: () => 'InboxHome',
  transitionDuration: 350,
  plugins: [basicRendererPlugin(), seedPlugin({ theme: 'cupertino' })],
})

export function Problem() {
  return <Stack />
}
