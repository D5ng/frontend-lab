# Drills

기법 하나를 하루 세 문제로 연습하는 앱입니다. 지식을 먼저 읽고, 리마인드 → 적용 → 확인 순서로 풉니다. 출제 방식과 기법 목록은 [Clean Code Drills 계획](../../docs/tracks/clean-code-drills.md)에 있습니다.

## 실행과 검사

저장소 루트에서 실행합니다.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm --filter @frontend-lab/drills lint
pnpm --filter @frontend-lab/drills format:check
pnpm --filter @frontend-lab/drills test
pnpm --filter @frontend-lab/drills build
```

## 문제 구조

드릴 하루가 폴더 하나입니다. 이어지는 문제 2와 3은 같은 폴더에 둡니다.

```text
problems/
  YYYY-MM-DD-slug/
    knowledge.md         # 오늘 기법의 지식. 첫 줄 제목이 기법 이름
    problem-1/           # 리마인드: 순수 TS 함수와 테스트 (화면 없음)
    problem-2/           # 적용: 앱 화면
      problem.md         # 첫 줄 제목이 목록에 보이는 이름
      Problem.tsx        # Problem 컴포넌트를 내보낸다
      handlers.ts        # 이 문제의 MSW 핸들러 (필요할 때만)
    problem-3/           # 확인: 문제 2를 이어받는 변경 요청
    note.md              # 문제마다 질문 하나, 2~3줄 답
```

- 화면이 있는 문제는 `problem-N/Problem.tsx`를 두기만 하면 목록에 나옵니다. 등록 파일이 따로 없어서 동시에 열린 PR끼리 충돌하지 않습니다.
- MSW 핸들러는 `problems/` 아래 어디에 있든 `handlers.ts`면 등록됩니다.
- 문제 화면은 남은 높이를 채우는 `app-frame` 틀 안에 그려집니다.

## 앱 화면 (Stackflow)

앱 바, 화면 이동, 뒤로 가기가 있는 화면은 SEED의 Stackflow 연동으로 만듭니다. 문제마다 자기 Stack을 만들어 그대로 반환합니다.

```tsx
import type { ActivityComponentType } from '@stackflow/react'
import { stackflow } from '@stackflow/react'

const CartHome: ActivityComponentType = () => (
  <AppScreen>
    <AppBar>
      <AppBarMain title="장바구니" />
    </AppBar>
    <AppScreenContent>{/* ... */}</AppScreenContent>
  </AppScreen>
)

const { Stack } = stackflow({
  activities: { CartHome, CartDetail },
  initialActivity: () => 'CartHome',
  transitionDuration: 350,
  plugins: [basicRendererPlugin(), seedPlugin({ theme: 'cupertino' })],
})
```

```tsx
export function Problem() {
  return <Stack />
}
```

- 화면은 `seed-design/ui/app-screen`의 `AppScreen`, `AppScreenContent`와 `seed-design/ui/app-bar`의 `AppBar` 계열로 구성합니다. 연결 확인 테스트는 `src/test/stackflow.spec.tsx`에 있습니다.
- Stackflow의 기본(stable) API를 씁니다. SEED 문서 예제는 `@stackflow/react/future`를 쓰는데, future API는 활동 이름을 앱 전체 타입에 등록해서 한 앱에 Stack이 둘 이상 생기면 서로의 활동까지 모두 등록하라고 타입 오류가 납니다. 문제마다 자기 Stack을 갖는 이 앱에는 Stack마다 따로 타입이 붙는 stable API가 맞습니다.
- 화면 안에서 이동은 `useActions()`의 `push`, `pop`으로 합니다.

## SEED 버전

SEED, Stackflow, MSW 버전은 루트 `pnpm-workspace.yaml`의 `catalog`에서 한 번에 정합니다. 설치된 SEED CSS 2.8에 맞춰 `@seed-design/stackflow` 2.0.4와 Stackflow 1.x로 고정했습니다.

`seed-design add`로 새 스니펫을 받기 전에는 `seed-design compat`으로 호환성을 확인합니다. 최신 레지스트리의 일부 스니펫(`ui:list`, `ui:app-screen`)은 SEED CSS 3.x를 요구합니다. 그런 스니펫은 CLI로 받지 말고 SEED 저장소의 맞는 릴리스 태그에서 가져옵니다. 지금의 `app-screen`, `app-bar`, `pull-to-refresh`는 `@seed-design/stackflow@2.0.4` 태그에서 가져왔습니다.
