# Daily Frontend

매일 15~25분 동안 프론트엔드 판단 하나를 연습하는 React 앱입니다. 모든 문제는 하나의 실행 환경과 React 의존성을 공유합니다. 날짜별 폴더에서 별도로 설치하지 않습니다.

## 실행과 검사

저장소 루트에서 실행합니다.

```sh
pnpm install --frozen-lockfile
pnpm dev:daily
```

터미널에 표시된 주소를 열고 상단에서 문제를 선택합니다. 문제별 주소는 URL의 `#날짜-주제`로 구분되므로 새로고침하거나 직접 열 수 있습니다. 다른 문제로 이동하면 이전 실습 상태는 초기화됩니다.

```sh
pnpm --filter @frontend-lab/daily-frontend lint
pnpm --filter @frontend-lab/daily-frontend format:check
pnpm --filter @frontend-lab/daily-frontend test
pnpm --filter @frontend-lab/daily-frontend build
```

루트의 `pnpm lint`, `pnpm format:check`, `pnpm test`, `pnpm build`에도 Daily 검사가 포함됩니다. 테스트는 Vitest의 jsdom 환경에서 실행되며, 아직 테스트 파일이 없는 경우에는 통과합니다. 이는 풀이의 정확성을 검증했다는 뜻은 아닙니다.

## 문제 구조

```text
src/
  App.tsx                 # 문제 선택과 화면 표시
  problems.ts             # 문제 목록 등록
  main.tsx                # 공통 React 진입점
problems/
  YYYY-MM-DD-topic/
    Problem.tsx           # 해당 문제의 실행 컴포넌트
    problem.md            # 사용자 목표와 완료 조건
    note.md               # 실습자가 작성하는 판단과 검증 기록
```

컴포넌트 구현 문제는 `Problem.tsx`를 직접 수정합니다. 함수 구현 문제는 준비된 화면에서 별도 `.ts` 함수를 호출하게 두고 함수만 수정합니다. 모의 API나 별도 스타터 파일은 필요한 문제에만 추가합니다. React 앱에서 실행하더라도 순수 계산까지 컴포넌트나 훅으로 만들 필요는 없습니다.

새 문제를 추가할 때는 `Problem` 컴포넌트를 내보내고 `src/problems.ts`에 고유한 폴더 이름, 제목, 컴포넌트를 등록합니다. 앱 설정이나 React 설치를 반복할 필요가 없습니다.

## 푸는 방법

1. 날짜별 폴더의 `problem.md`에서 사용자 목표와 완료 조건을 읽습니다.
2. 먼저 `note.md`에 원인과 접근을 적거나 구현을 시작합니다.
3. 화면에서 완료 조건을 확인합니다. 실행한 순서, 기대한 결과, 실제 관찰한 결과를 기록합니다. 코드 흐름만 추적했다면 예상 결과임을 구분합니다.
4. 답을 공유하면 맞는 판단과 수정할 판단을 근거와 함께 검토합니다.

스타터 파일은 정답이 아니며, `note.md`의 판단과 결론은 실습자가 작성합니다. 예약된 문제는 `problems/YYYY-MM-DD-주제/`에 하루 한 폴더씩 추가합니다. 기존 문제와 풀이 파일은 다음 출제 때 수정하지 않습니다.

## 현재 문제

- **2026-09-30 · 늦게 도착한 검색 결과**: 기존 `starter.tsx`를 그대로 실행합니다. 샘플 상품은 “맥”, “맥북”, “아이폰”, “아이패드” 등으로 검색할 수 있습니다. 한 글자 검색어는 2초, 나머지는 0.6초 뒤 응답합니다. 모의 요청은 취소를 지원하지 않으므로 flag 방식으로 결과 반영 여부를 제어합니다.
- **2026-10-01 · 선택한 항목은 몇 개일까?**: 체크박스를 바꾸면 `starter.ts`의 `getSelectionSummary` 반환값이 화면에 표시됩니다. 함수는 미완성 상태로 유지합니다. 선택 개수와 삭제 가능 여부를 구현한 뒤 선택 0개, 1개, 2개 및 전체 삭제 후 빈 목록을 확인합니다.
