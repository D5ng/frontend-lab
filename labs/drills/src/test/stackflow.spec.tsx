import '@testing-library/jest-dom/vitest'
import { seedPlugin } from '@seed-design/stackflow'
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic'
import type { ActivityComponentType } from '@stackflow/react'
import { stackflow, useActions } from '@stackflow/react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'

// 문제마다 자기 Stack을 만든다. stable API는 활동 이름을 Stack마다 따로 타입으로 잡아서,
// 한 앱에 Stack이 여럿 있어도 서로의 활동을 등록하라고 요구하지 않는다.
const SmokeHome: ActivityComponentType = () => {
  const { push } = useActions()
  return (
    <AppScreen>
      <AppBar>
        <AppBarMain title="홈" />
      </AppBar>
      <AppScreenContent>
        <button type="button" onClick={() => push('SmokeDetail', {})}>
          상세 보기
        </button>
      </AppScreenContent>
    </AppScreen>
  )
}

const SmokeDetail: ActivityComponentType = () => (
  <AppScreen>
    <AppBar>
      <AppBarLeft>
        <AppBarBackButton />
      </AppBarLeft>
      <AppBarMain title="상세" />
    </AppBar>
    <AppScreenContent>상세 내용</AppScreenContent>
  </AppScreen>
)

const { Stack } = stackflow({
  activities: { SmokeHome, SmokeDetail },
  initialActivity: () => 'SmokeHome',
  transitionDuration: 0,
  plugins: [basicRendererPlugin(), seedPlugin({ theme: 'cupertino' })],
})

test('앱 화면으로 이동하고 뒤로 돌아온다', async () => {
  const user = userEvent.setup()
  render(<Stack />)

  expect(screen.queryByRole('button', { name: '뒤로' })).not.toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: '상세 보기' }))
  expect(await screen.findByText('상세 내용')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: '뒤로' }))
  await waitFor(() => expect(screen.queryByText('상세 내용')).not.toBeInTheDocument())
})
