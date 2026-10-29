# Assignments

요구사항 분석부터 페이지 하나를 끝까지 만드는 과제 앱입니다. 드릴 여섯 번마다 한 번 풉니다. 출제 방식은 [Clean Code Drills 계획](../../docs/tracks/clean-code-drills.md)에 있습니다.

## 실행과 검사

저장소 루트에서 실행합니다.

```sh
pnpm install --frozen-lockfile
pnpm dev:assignments
```

```sh
pnpm --filter @frontend-lab/assignments lint
pnpm --filter @frontend-lab/assignments format:check
pnpm --filter @frontend-lab/assignments test
pnpm --filter @frontend-lab/assignments build
```

## 과제 구조

과제 하나가 폴더 하나입니다. **화면은 다 그려진 채로 주고, 동작은 주지 않습니다.** 모든 화면이 SEED와 Stackflow로 그려져 있고, 값은 예시로 박혀 있고, 핸들러는 `() => {}`로 비어 있습니다. 처음엔 안 보이는 상태(불러오는 중, 오류, 빈 결과 등)는 주석으로 들어 있고 언제 보여 줄지 한 줄 안내가 붙어 있습니다.

지켜야 할 약속은 하나뿐입니다. **`App.tsx`에서 `App` 컴포넌트를 내보낸다.** 받은 화면 파일을 그대로 쓸지, 나눌지, 옮길지와 상태 설계, 폴더 구조는 모두 직접 정합니다.

```text
problems/
  YYYY-MM-DD-slug/
    problem.md     # 과제 문서. 첫 줄 제목이 목록에 보이는 이름
    handlers.ts    # 모의 API (출제자가 준비한다. 풀이 대상이 아니다)
    App.tsx        # App을 내보낸다. 그려진 화면이 들어 있다. 나머지 구조는 자유
    note.md        # 요구사항 분석과 판단 기록
```

- `App.tsx`가 있는 폴더는 목록에 자동으로 나옵니다. 등록 파일이 따로 없어서 동시에 열린 PR끼리 충돌하지 않습니다.
- MSW 핸들러는 `problems/` 아래 어디에 있든 `handlers.ts`면 등록됩니다.
- 과제 화면은 남은 높이를 채우는 `app-frame` 틀 안에 그려집니다. Stackflow를 쓰면 `App`에서 `<Stack />`을 그대로 반환하면 됩니다. 사용법은 [Drills README](../drills/README.md#앱-화면-stackflow)와 같습니다.

## SEED 버전

SEED, Stackflow, MSW 버전은 루트 `pnpm-workspace.yaml`의 `catalog`에서 한 번에 정합니다. 새 스니펫을 받을 때의 주의점은 [Drills README](../drills/README.md#seed-버전)에 있습니다.
