# 2026-10-05 · 숨겨진 상품도 선택한 상품일까?

- 유형: 리팩터링형
- 예상 시간: 30~40분

## 사용자 목표

관심 상품을 고르고, 나눔 필터로 목록을 좁히더라도 **이미 선택한 모든 상품을 함께 예약**한다.

## 핵심 설계 질문

> 보이는 상품과 선택한 상품의 범위가 달라질 때, 화면 요약과 예약 요청에서 함께 바뀌어야 하는 규칙은 무엇이며 어디까지 묶는 것이 적절할까요?

`starter.tsx`는 이미 동작합니다. 같은 상품 범위의 계산이 요약·비활성 조건·요청 곳곳에 있고, 선택을 변경하는 이벤트와 요청 결과 처리도 한 컴포넌트에 있습니다. 코드를 실행하고 읽은 뒤, 외부 동작을 유지하며 책임 경계를 판단하세요. 반복식을 없애는 것만 목표로 삼지 않습니다. 특정 함수·훅·파일 수나 정답 구조는 요구하지 않습니다.

[Frontend Fundamentals](https://frontend-fundamentals.com/code-quality/code/)의 가독성·예측 가능성·응집도·결합도를 판단의 참고 기준으로 사용합니다. 학습자의 재구성 답안은 제공하지 않습니다.

## 관찰 가능한 요구사항

1. 처음에는 전체 상품 3개가 보이고 아무것도 선택하지 않습니다. `전체`는 모든 상품, `나눔`은 가격이 0원인 상품만 표시합니다. 상품 행 전체를 눌러 선택·해제합니다. 필터 전환은 선택을 바꾸지 않습니다.
2. 요약의 개수·금액·상품 이름은 **숨겨진 상품까지 포함한 전체 선택**을 기준으로 합니다. 이름과 요청 ID 순서는 원래 상품 목록 순서입니다. 나눔 필터에서 숨겨진 선택 상품이 있으면 그 개수와 예약 포함 사실을 안내합니다. 나눔 상품만 선택해 금액이 0원이더라도 예약할 수 있습니다. 선택이 없으면 버튼을 비활성화하고 선택 안내를 보여 줍니다.
3. 예약 요청은 아래 형태입니다. 요청 중 필터·상품 선택·예약 버튼을 모두 잠그고 버튼의 진행 표시와 `선택한 상품을 예약하고 있어요. 잠시 기다려 주세요.` 안내를 보여 줍니다. 버튼의 접근성 이름은 `예약 중`입니다. 중복 요청하지 않습니다. 실패하면 오류와 재시도 안내를 표시하고 **필터와 선택을 모두 유지**합니다. 성공하면 성공 안내를 표시하고 **선택만 비우고 필터를 유지**합니다. 새 선택 또는 필터 변경은 이전 결과 안내를 제거합니다.

```ts
type Reservation = { productIds: string[]; totalPrice: number }
type ReserveProducts = (reservation: Reservation) => Promise<void>
```

예: 책상과 화분을 선택한 뒤 나눔 필터에서 예약해도 `{ productIds: ['desk', 'plant'], totalPrice: 12000 }`을 보냅니다. 예약은 결제가 아니며 금액은 상품 합계 안내입니다. 배송비·수량·판매 완료·실제 서버는 없습니다.

## 입력과 실행 환경

`api.ts`는 책상 12,000원, 소설책 5,000원, 화분 나눔의 고정 목록과 모의 API를 제공합니다. API는 0.8초 뒤 완료하며 첫 요청만 실패하고 이후 성공합니다. 화면을 나갔다 돌아오면 호출 횟수가 초기화됩니다. 실제 네트워크·서버 저장은 없습니다. 테스트의 `reserveProducts` 주입 경계는 유지합니다.

```sh
pnpm install --frozen-lockfile
pnpm dev:daily
pnpm --filter @frontend-lab/daily-frontend exec vitest run problems/2026-10-05-filtered-selection/Problem.spec.tsx
pnpm --filter @frontend-lab/daily-frontend build
```

앱에서 `숨겨진 상품도 선택한 상품일까?`를 선택하거나 `#2026-10-05-filtered-selection`로 진입합니다. 별도 worktree에서 실행하며 원본 풀이를 복사할 필요는 없습니다.

## 화면 맥락과 SEED 사용 확인

375px 모바일에서 제목 → 보기 필터 → 상품 선택 목록 → 전체 선택 요약 → 결과 안내 → 하나의 예약 액션 순서입니다. 학습 주제와 무관한 상세 화면이나 선택 팝업은 추가하지 않습니다. 출제 스킬의 Montage 대신 사용자가 지정한 SEED Design을 적용합니다.

- 보기 필터: 공식 SegmentedControl Root·Item·ItemHiddenInput·Indicator. 두 짧은 선택지로 현재 목록만 필터링합니다.
- 상품 선택: 공식 List Root·Item·Content·Title·Detail·Suffix와 Checkbox Root.Primitive·Control·Indicator·HiddenInput을 조합합니다. 설치본 React 2.5.1에는 최신 문서의 List.CheckItem이 없어, 같은 세대 공식 List 스니펫의 `Item asChild` + Checkbox Primitive 패턴을 사용합니다. native checkbox를 직접 만들거나 기존 스니펫을 수정하지 않습니다. 행 전체가 라벨이며 입력마다 상품 이름을 제공합니다. 3개 선택지는 공식 가이드에 따라 ghost checkmark를 사용합니다.
- 예약: 설치된 공식 ActionButton 스니펫의 brandSolid·large·loading·disabled. 진행 중에도 접근성 이름을 제공합니다.
- 오류·성공: 공식 Callout 파츠, alert·status 의미. 결과가 초기화 뒤에도 남아야 하므로 인라인으로 둡니다.
- 정보 계층·여백: 공식 Text·VStack과 공개 x 토큰. CSS는 너비·줄바꿈·필터 터치 영역만 보완합니다. 자유 입력이 없어 TextField는 사용하지 않습니다. 별도 article로 기존 native section CSS 영향을 피합니다.

## 완료 조건

- 제공된 행동·API 테스트 8개를 그대로 통과시키고, 필터로 선택을 숨긴 뒤 실패→재시도→성공 흐름을 실제 화면에서 확인합니다. 테스트를 약화시켜 구조 변경을 맞추지 않습니다.
- 재구성한 경계와 그대로 둔 구조의 이유·비용을 `note.md`에 직접 기록합니다. 핵심 질문 하나에 집중하고 기능을 추가하지 않습니다.
- 실제 실행해 확인한 결과와 코드만 읽고 예상한 결과를 구분합니다.

## 출제 시 검증 범위

- 최신 `origin/develop`에서 만든 별도 worktree에 frozen lockfile 설치와 정상 설치 훅을 완료했습니다. 기존 풀이 PR #23과 아직 머지되지 않은 출제 PR #20·#21·#22는 읽기만 참고하며 변경을 섞지 않았습니다. 원본 checkout은 변경하지 않았습니다.
- 전체 `pnpm lint`, `pnpm format:check`, `pnpm test`, `pnpm build` 통과. build에 TypeScript 검사가 포함됩니다. Daily 기존 10개 + 오늘 행동·API 8개, code-quality 22개가 모두 통과했고 건너뛴 테스트는 없습니다.
- 실제 Chromium 375×812에서 초기 비활성·상품 선택·나눔 필터·숨겨진 선택 요약·요청 중 잠금·실패 후 선택 보존·재시도 성공·선택 초기화와 필터 유지·나눔만 선택한 0원 예약 가능 상태를 조작했습니다. 6개 화면에서 가로 넘침이 없고, 필터 라벨 48px·상품 행 66px·예약 버튼 52px을 확인했습니다. 접근성 이름과 선택·비활성 속성, 콘솔 오류·경고 없음도 확인했습니다. 다른 브라우저·스크린리더·실제 서버는 미검증입니다.
- `seed-design compat`는 기존 `ui:list`와 최신 registry의 CSS ^3.0.0 요구 범위 차이로 실패합니다. 오늘은 그 스니펫을 import하지 않고 설치된 React 2.5.1·CSS 2.8.3의 공식 List·Checkbox 파츠를 사용해 타입과 실제 렌더를 확인했습니다. 기존 의존성·스니펫·lockfile·보안 정책·훅은 수정하지 않았으며, 전역 호환성 실패를 숨기지 않도록 Draft PR로 제공합니다.
