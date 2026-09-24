# Montage 카탈로그

기준 문서: [Components](https://montage.wanted.co.kr/docs/components) · [Foundations](https://montage.wanted.co.kr/docs/foundations) · [Utilities](https://montage.wanted.co.kr/docs/utilities)

**이 문서는 지도이지 계약이 아니다.** props와 동작의 근거는 언제나 설치된 패키지의 타입 선언이다. 쓰기 전에 확인한다.

```bash
# export 이름 전체
grep -o "^export {[^}]*}" labs/code-quality/node_modules/@wanteddev/wds/dist/index.d.ts

# 특정 컴포넌트의 props
cat labs/code-quality/node_modules/@wanteddev/wds/dist/components/<이름>/types.d.ts

# 실제 렌더링되는 DOM과 role
cat labs/code-quality/node_modules/@wanteddev/wds/dist/components/<이름>/index.mjs
```

## 문서 이름과 코드 이름이 다른 것

여기서 가장 많이 틀린다.

| 문서 | 코드 |
| --- | --- |
| Bottom sheet | `Modal` + `ModalContainer variant="bottom"` (`handle`로 드래그 손잡이) |
| Popup | `Modal` + `ModalContainer variant="popup"` |
| List cell | `ListCell` (+ `ListCellContent`, 보통 `List` 안에) |
| List card | `CardList` + `CardListContent` |
| Radio | `RadioGroup` + `RadioGroupItem` |
| Framed style | `framedStyle` 유틸 |
| Media / Navigation (utilities) | `useMediaQuery`, `TopNavigation` / `BottomNavigation` |

## 컴포넌트 그룹

- **Actions** — `ActionArea`+`ActionAreaButton`, `Button`, `Chip`, `IconButton`, `TextButton`
- **Contents** — `Accordion`, `Avatar`, `AvatarGroup`, `Card`, `ContentBadge`, `CardList`, `ListCell`, `PlayBadge`, `SectionHeader`, `Table`, `Thumbnail`
- **Feedback** — `Alert`, `FallbackView`, `PushBadge`, `SectionMessage`, `Snackbar`, `Toast`
- **Loading** — `Loading`, `Skeleton`
- **Navigations** — `BottomNavigation`, `Category`, `PageCounter`, `Pagination`, `PaginationDots`, `ProgressIndicator`, `ProgressTracker`, `Tab`, `TopNavigation`
- **Presentation** — `Autocomplete`, `Modal`(bottom sheet / popup), `Menu`, `Popover`, `Tooltip`
- **Selection And Input** — `CheckMark`, `Checkbox`, `DatePicker`, `FilterButton`, `RadioGroup`, `SearchField`, `SegmentedControl`, `Select`, `Slider`, `Switch`, `TextArea`, `TextField`, `TimePicker`

## 유틸리티

- **컴포넌트** — `AnimationPresence`, `Box`, `DismissableLayer`, `Divider`, `FlexBox`, `FocusScope`, `ForceTheme`, `FormField`/`FormLabel`/`FormControl`/`FormMessage`/`FormErrorMessage`, `Grid`/`GridItem`, `Label`, `NoSsr`, `Popper`, `Portal`, `RegionConfig`, `ScrollArea`, `Typography`, `WithInteraction`
- **훅과 함수** — `useToast`, `useSnackbar`, `useAlert`, `useThemeControl`, `useMediaQuery`, `useSize`, `addOpacity`, `gradient`, `containerStyle`, `listStyle`, `typographyStyle`, `ellipsisTypographyStyle`, `hideOthers`

## 토큰

색은 `color="semantic.<group>.<...>"` prop 또는 CSS 변수 `--semantic-<group>-<...>`로 쓴다.

- `label` — normal, strong, neutral, alternative, assistive, disable
- `background` — normal.normal, normal.alternative, elevated.normal, elevated.alternative, transparent.*, status.*
- `line` — normal.normal, normal.neutral, normal.alternative, solid.*, primary.*, status.*
- `primary` — normal, strong, heavy
- `status` — positive, cautionary, negative
- `fill` — normal, strong, alternative
- `static` — white, black / `inverse` — background, label, primary
- `interaction` — inactive, disable
- `elevation` — shadow.normal.*, shadow.drop.*, shadow.spread.*

`Typography variant` — display1~3, heading1~2, headline1~2, title1~3, body1, body1-reading, body2, body2-reading, label1, label1-reading, label2, caption1, caption2 / `weight` — regular, medium, bold

아이콘은 `@wanteddev/wds-icon`에서 가져온다. 이름 패턴: `Icon<Name>`, 채움은 `Fill`, 크기·두께는 `Small`/`Thick`/`Tight` 조합(`IconChevronRightTightSmall`).

## 실전에서 걸리는 것들

이 저장소에서 실제로 부딪혀 확인한 내용이다.

### 스타일 우선순위

Montage는 emotion으로 런타임에 스타일을 주입한다. 클래스 하나짜리 선택자(`.my-class`)는 컴포넌트 기본 스타일에 밀린다. 레이아웃을 덮어쓰려면 선택자를 한 단계 더 구체적으로 쓴다.

```css
/* .participation-actions 만으로는 position이 적용되지 않는다 */
.mobile-event-app .participation-actions {
  position: fixed;
}
```

### 폼 라벨

`FormField` > `FormLabel` + `FormControl` 조합이 `aria-labelledby`를 연결한다. `FormControl`은 Slot이므로 자식 하나에 속성을 내려 준다. 이 구조를 쓰면 테스트에서 `getByRole('textbox', { name: '라벨' })`이 동작한다.

### 접근성 이름

- `Switch`와 `Checkbox`는 텍스트가 없다. `aria-label`을 직접 준다. → `getByRole('switch' | 'checkbox', { name: ... })`. 두 컴포넌트는 `checked` / `onCheckedChange` / `disabled` 계약이 같아서 서로 바꿔 끼울 수 있다.
- `TextButton`은 내부 텍스트를 가리키는 `aria-labelledby`를 스스로 붙인다. **밖에서 준 `aria-label`은 무시된다.** 버튼의 보이는 텍스트로 찾는다.
- `ListCell`은 `role="listitem"`이고 기본 `as`는 `li`다. `List`(ul) 안에 둔다. 행을 누르면 행 안의 조작 가능한 요소가 대신 눌리는데, 그 대상에 `role="checkbox"`와 `role="radio"`는 들어가고 **`role="switch"`는 빠져 있다.** 그래서 체크박스 행은 그대로 두면 행 전체가 터치 영역이 되고, 스위치 행은 `disableInteraction`을 줘야 눌리지 않는 행처럼 보이지 않는다.
- 달력 날짜는 `role="gridcell"`이고 접근성 이름은 날짜 숫자뿐이다. 오늘은 `aria-current="date"`로 찾는 것이 안정적이다. → `getByRole('gridcell', { current: 'date' })`

### Bottom Sheet

```tsx
<Modal onOpenChange={setOpen} open={open}>
  <ModalContainer handle resize="hug" variant="bottom">
    <ModalNavigation />
    <ModalContent>
      <ModalContentItem>...</ModalContentItem>
    </ModalContent>
    <ActionArea variant="strong">
      <ActionAreaButton onClick={close} type="button">적용</ActionAreaButton>
    </ActionArea>
  </ModalContainer>
</Modal>
```

`ModalContent`에는 좌우 패딩이 없다. 가로 여백은 `ModalContentItem`이 준다. 이걸 빼면 내용이 화면 끝에 붙는다.

**`handle`은 단순 선택 시트에서 시트를 가두는 함정이다.** `handle`을 켜면 드래그 손잡이가 생기지만, 바깥 클릭·ESC·아래로 드래그가 시트를 닫지 않고 `visibility="hidden"`(아래에 걸쳐 두는 peek 상태)으로 바꾼다. `ModalNavigation`이 없으면 걸쳐질 높이도 없어서 시트가 그대로 떠 있는 것처럼 보인다. 손잡이를 쓰면서 제대로 닫으려면 `Modal`에 닫는 규칙을 직접 준다.

```tsx
<Modal
  onOpenChange={setOpen}
  onVisibilityChange={(visibility) => visibility === 'hidden' && setOpen(false)}
  open={open}
>
```

**시트와 다이얼로그는 body로 포털되므로 모바일 폭을 벗어난다.** 바텀 시트는 뷰포트 기준 최대 480px, 팝업은 뷰포트 가운데다. 375px 목업 안에 맞추려면 래퍼를 다시 고정한다. `ModalContainer`와 `AlertContainer` 모두 `wrapperProps`를 받는다.

```tsx
<ModalContainer variant="bottom" wrapperProps={{ className: 'mobile-modal-layer' }}>
```

```css
/* 포털된 래퍼는 .mobile-event-app 밖에 있으므로 body로 한 단계 더 구체화한다 */
body .mobile-modal-layer {
  width: min(100%, 375px);
  left: 50%;
  transform: translateX(-50%);
}
```

### Toast / Snackbar

- `Toast`는 `ThemeProvider`가 만드는 `#wds-region-manager-bottom`으로 포털된다. 기본 위치는 화면 최하단이라 고정 하단 버튼과 겹친다.
- `RegionConfig`로 띄우는 위치와 폭을 맞춘다. 앱 루트에 한 번 둔다.

```tsx
<RegionConfig viewportBottom="96px" viewportMaxWidth="375px" />
```

- `variant="negative"`는 `role="alert"`, 그 외에는 `role="status"`가 붙는다. 별도 `aria-live`를 만들 필요가 없다.
- 기본 노출 시간은 3초다. 사라지면 안 되는 정보는 Toast에 담지 않는다.

### 날짜

- `DateCalendar`/`DatePicker`의 `onChange`는 `DateType`(`Date | string | null | undefined`)을 준다. 내부적으로 dayjs가 오갈 수 있으므로 `new Date(value)`로 정규화한 뒤 다룬다.
- `min`에 오늘을 줄 때는 `setHours(0, 0, 0, 0)`으로 자정을 만든다. 현재 시각을 그대로 주면 오늘이 비활성된다.
- 화면 표시 형식과 서버로 보내는 형식은 다르다. 변환 위치를 설계 시점에 정한다.

### 숫자 입력

`type="number"`는 role이 `spinbutton`이 되고 모바일 키패드도 원하는 모양이 아니다. `inputMode="numeric"`을 쓰고 단위는 `trailingContent={<TextFieldContent variant="text">원</TextFieldContent>}`로 붙인다.

### jsdom 폴리필

Modal·Toast·ScrollArea는 jsdom에 없는 브라우저 API를 쓴다. 없으면 렌더 자체가 실패한다. `src/test/setup.ts`에 다음이 있어야 한다.

- `window.matchMedia`
- `window.ResizeObserver`
- `Element.prototype.getAnimations`
