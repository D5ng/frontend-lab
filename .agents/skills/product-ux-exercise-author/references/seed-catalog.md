# SEED 카탈로그

**이 문서는 지도이지 계약이 아니다.** props와 동작의 근거는 언제나 설치된 패키지의 타입 선언과 스니펫 코드다. 쓰기 전에 확인한다.

## 버전

SEED, Stackflow, MSW 버전은 루트 `pnpm-workspace.yaml`의 `catalog` 한곳에서 정한다.

| 패키지 | 버전 | 이유 |
| --- | --- | --- |
| `@seed-design/react` | 2.5.x | |
| `@seed-design/css` | 2.8.x | 올리면 모든 화면이 바뀐다 |
| `@seed-design/stackflow` | 2.0.4 고정 | 2.0.5부터 CSS 2.9 이상을 요구한다 |
| `@stackflow/react` 외 | 1.x | stable API(`@stackflow/react`)를 쓴다 |
| `@stackflow/plugin-renderer-basic` | 1.1.13 고정 | 1.1.14부터 Stackflow 2.x를 요구한다 |

## 확인하는 법

```bash
# 컴포넌트 목록
ls labs/drills/node_modules/@seed-design/react/lib/components

# 컴포넌트 props
cat labs/drills/node_modules/@seed-design/react/lib/components/<이름>/<이름>.d.ts

# tone, variant, size 같은 선택지
cat labs/drills/node_modules/@seed-design/css/recipes/<이름>.d.ts
```

## 스니펫

SEED는 많은 컴포넌트를 앱마다 복사해 쓰는 스니펫으로 준다. 각 앱의 `src/seed-design/ui/`에 있고 `seed-design/ui/<이름>`으로 가져온다.

**새 스니펫은 `seed-design add`로 받지 않는다.** 최신 레지스트리의 일부 스니펫은 SEED CSS 3.x를 요구한다. 대신 설치 버전과 맞는 태그에서 가져온다.

```bash
gh api "repos/daangn/seed-design/contents/docs/registry/react/ui/<이름>.tsx?ref=@seed-design/react@2.5.1" \
  -H 'Accept: application/vnd.github.raw'
```

가져온 뒤 손볼 것

1. 첫 줄 `"use client";`를 지운다.
2. 머리에 `@file ui:<이름>`과 가져온 태그를 적는다.
3. `process.env.NODE_ENV !== 'production'`을 `import.meta.env.DEV`로 바꾼다. 브라우저에는 `process`가 없다.
4. 멤버 없는 `interface X extends Y {}`를 `type X = Y`로 바꾼다. 린트 규칙이다. 여러 개를 extends하면 `&`로 잇는다.
5. `prettier --write`와 `eslint --fix`, `tsc --noEmit`을 돌린다.

`app-screen`, `app-bar`, `pull-to-refresh`는 `@seed-design/stackflow@2.0.4` 태그에서 가져왔다. 같은 방법으로 `ref`만 바꾼다.

`ControlChip`은 2.5에서 deprecated다. 대신 `Chip`(`Chip.Toggle`, `Chip.RadioRoot`, `Chip.RadioItem`, `Chip.Button`)을 쓴다.

## 앱 화면 (Stackflow)

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

- **stable API를 쓴다.** SEED 문서 예제의 `@stackflow/react/future`는 활동 이름을 앱 전체 타입(`declare module '@stackflow/config'`)에 등록한다. 한 앱에 Stack이 둘 이상이면 각 Stack이 모든 활동을 등록하라고 타입 오류가 난다. 문제마다 Stack을 따로 두는 이 저장소에서는 쓰지 않는다.
- 활동 이름은 도메인 이름을 붙여 읽기 쉽게 한다(`SalonHome`, `CartDetail`).
- 화면은 `AppScreen` > `AppBar`(`AppBarLeft`, `AppBarMain`, `AppBarRight`) + `AppScreenContent`로 짠다. `AppBarBackButton`은 첫 화면에서 저절로 숨는다.
- `AppScreen`은 부모 기준 absolute로 그려진다. 앱 셸이 남은 높이를 채우는 `app-frame`을 주므로 문제 쪽에서 틀을 만들 필요는 없다.
- **화면 안의 바텀시트는 두 가지를 지킨다.** 하나라도 빠지면 시트가 화면 위쪽에 잘려 보이거나 화면 아래에 깔려 안 보인다.
  1. `BottomSheetContent`를 스크롤되는 `AppScreenContent` 밖, `AppScreen` 바로 아래에 둔다. 트리거가 내용 안에 있으면 `BottomSheetRoot`로 `AppScreen` 전체를 감싼다.
  2. `layerIndex={useActivityZIndexBase()}`를 넘긴다(`@seed-design/stackflow`). SEED 공식 예제도 이렇게 한다.
- 시트를 하나의 활동으로 띄우는 방식(SEED 문서의 Stackflow Bottom Sheet)도 있다. 뒤로 가기로 시트가 닫혀야 하면 그쪽을 검토한다.
- 이동은 `useActions()`의 `push`, `pop`이다. `stackflow()`가 돌려주는 `useFlow`는 타입이 붙지만, 화면 파일이 Stack 파일을 다시 가져오는 순환을 만들기 쉽다. 과제의 정적 UI에서는 이동을 연결하지 않는다.

## 장면별 컴포넌트

`R`은 `@seed-design/react`에서 바로, `S`는 스니펫(`seed-design/ui/...`)에서 가져온다. 스니펫이 아직 없는 앱이면 위 방법으로 가져온다.

| 장면 | 컴포넌트 | 선택지 |
| --- | --- | --- |
| 배치·글자 | R `VStack`, `HStack`, `Box`, `Text`, `Divider` | `gap="x3"`, `p="x5"` 같은 토큰 |
| 목록 | S `List`, `ListItem`, `ListButtonItem`, `ListCheckItem`, `ListRadioItem`, `ListSwitchItem`, `ListDivider` | `title`, `detail`, `prefix`, `suffix` |
| 목록 제목 | S `ListHeader` | |
| 주 버튼 | S `ActionButton` | `variant`: brandSolid, neutralSolid, neutralWeak, criticalSolid, brandOutline, neutralOutline, ghost / `size`: xsmall~large / `loading` |
| 탭형 필터 | S `ChipTabsRoot`, `ChipTabsList`, `ChipTabsTrigger`, `ChipTabsContent` | `variant`: neutralSolid, neutralOutline / `size`: medium, large |
| 여러 개·하나 고르기 칩 | S `Chip.Toggle`, `Chip.RadioRoot` + `Chip.RadioItem` | |
| 체크박스·라디오 | S `Checkbox`, `CheckboxGroup`, `RadioGroup` | |
| 입력 | S `TextField`, `Select` | |
| 바텀시트 | S `BottomSheetRoot`, `BottomSheetTrigger`, `BottomSheetContent`(`title`, `description`), `BottomSheetBody`, `BottomSheetFooter` | 제목이 없으면 `aria-label` |
| 남는 안내 | S `Callout` (`description` 필수, `title`) | `tone`: neutral, informative, positive, warning, critical, magic |
| 화면 위 띠 안내 | R `InlineBanner` | `variant`: neutralWeak, positiveWeak, informativeWeak, warningWeak, warningSolid, criticalWeak, criticalSolid |
| 잠깐 뜨는 결과 | S `SnackbarProvider`(앱 위쪽에 한 번), `useSnackbarAdapter().create(...)`, `Snackbar`(`message`, `actionLabel`, `onAction`) | `variant`: default, positive, critical |
| 불러오는 중 | R `Skeleton` / S `ActionButton loading` / S `ProgressCircle` | `tone`: neutral, magic |
| 사람 | S `Avatar`(`src`, `fallback`), R `MannerTemp`, `MannerTempBadge` | |
| 작은 표시 | R `Badge` | `variant`: weak, solid, outline / `tone`: neutral, brand, informative, positive, warning, critical |
| 이미지 자리 | S `ContentPlaceholder`, R `ImageFrame` | |
| 날짜·시간·수량 | R `DatePicker`, `TimePicker`, `WheelPicker`, `QuantityPicker` | 레지스트리에 스니펫이 있으면 스니펫을 먼저 쓴다 |
| 켜고 끄기 | R `Switch`, `ToggleButton` | 저장 버튼이 있는 폼이면 Switch가 아니라 Checkbox |

위 표에 없는 컴포넌트는 `lib/components` 목록과 SEED 문서에서 찾는다. 문서: https://seed-design.io/react/llms.txt
