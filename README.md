# frontend-lab

기능을 빨리 완성하는 곳이 아니라, **요구사항이 바뀔 때 React 코드를 어디서 나누고 무엇을 함께 둘지 판단하는 연습**을 기록하는 저장소입니다.

문제마다 동작하는 화면과 행동 테스트를 만들고, 그 과정에서 내린 결정을 풀이 기록으로 남깁니다. 이 저장소의 주된 결과물은 코드보다 "왜 이렇게 했는가"입니다.

## 문제 하나는 이렇게 진행합니다

1. **문제를 읽습니다.** `problem.md`에는 사용자 목표와 관찰 가능한 완료 조건이 있고, 정답 구조는 없습니다.
2. **가설을 먼저 적습니다.** 구현 전에 상태의 원본, 책임, 예상되는 변경 이유를 `note.md`에 적습니다.
3. **구현하거나 리팩터링합니다.** 지켜야 할 동작은 사용자 행동을 기준으로 한 테스트로 고정합니다.
4. **PR로 올립니다.** 무엇을 왜 바꿨는지와 어떻게 검증했는지를 적습니다.
5. **판단을 되짚습니다.** 결정마다 "어떤 근거로, 왜?"라는 질문에 답하고, 리뷰를 받아 맞은 판단과 고칠 판단을 나눠 둡니다.

문제는 두 종류입니다. 이미 동작하는 코드를 외부 동작은 그대로 두고 재구성하는 **리팩터링형**, 요구사항만 받아 처음부터 만드는 **직접 구현형**입니다. 두 유형 모두 [Frontend Fundamentals](https://frontend-fundamentals.com/code-quality/code/)의 가독성, 예측 가능성, 응집도, 결합도를 판단 기준으로 씁니다.

## 무엇이 남나요

| 결과물      | 위치                      | 보여 주는 것                                  |
| ----------- | ------------------------- | --------------------------------------------- |
| 실습 화면   | 문제 폴더의 `Problem.tsx` | 실제 모바일 제품의 한 장면                    |
| 행동 테스트 | `Problem.spec.tsx`        | 구조를 바꿔도 지켜야 하는 사용자 행동         |
| 풀이 기록   | `note.md`                 | 결정마다의 근거, 잘못 이해한 부분과 바뀐 관점 |
| PR          | Pull Requests             | 변경 이유와 검증한 범위                       |

### 대표 풀이

처음이라면 아래 두 기록을 순서대로 읽어 보세요. 유형은 다르지만 하나의 질문으로 이어집니다.

**[10월 3일 · 예약 취소 정책의 변경 경계](labs/daily-frontend/problems/2026-10-03-reservation-policy/note.md)** · 리팩터링형 · [PR #32](https://github.com/D5ng/frontend-lab/pull/32)

안내 문구, 환불 금액, 서버 요청에 흩어진 취소 규칙을 한곳으로 모읍니다. 숫자 `2000`처럼 같은 글자로 반복되는 중복은 처음부터 모았지만, "이미 시작한 예약은 취소할 수 없다"처럼 같은 뜻이 다른 모양으로 흩어진 규칙은 리뷰를 받고서야 찾았습니다. 쓰는 쪽이 `reset()`을 빠뜨리면 생기는 버그를, 주의가 아니라 구조로 막은 과정도 담겨 있습니다.

**[10월 4일 · 빠른 동네 선택과 늦은 게시글](labs/daily-frontend/problems/2026-10-04-neighborhood-feed/note.md)** · 직접 구현형 · [PR #39](https://github.com/D5ng/frontend-lab/pull/39)

동네를 빠르게 바꿀 때 늦게 도착한 이전 응답이 화면을 덮지 않게 만듭니다. "요청은 막을 수 없으니 상태 업데이트를 막아야 한다"에서 출발해, 성공뿐 아니라 실패와 완료에서도 오래된 응답을 걸러야 하는 이유를 시점별 화면으로 따라갑니다. 마지막 항목에서는 10월 3일과 달리 선택 상태를 훅 밖에 둔 이유를 "쓰는 쪽에게 지켜야 할 약속이 남는가"로 비교합니다.

## 실습 공간

| 폴더                                                   | 무엇을 하나                                                                | 실행             |
| ------------------------------------------------------ | -------------------------------------------------------------------------- | ---------------- |
| [`labs/daily-frontend`](labs/daily-frontend/README.md) | 하루 25~40분, 설계 질문 하나를 푸는 날짜별 문제                            | `pnpm dev:daily` |
| [`labs/code-quality`](labs/code-quality/README.md)     | 제품에 가까운 화면에 요구사항을 더해 가며 함께 바뀌는 코드를 관찰하는 연습 | `pnpm dev`       |

등록된 문제 목록, 출제 기준, 디자인 시스템과 모의 서버 구성은 각 폴더의 README에 있습니다.

다음 단계는 아직 코드 없이 문서로만 계획해 두었습니다.

- [Mini Store Admin](docs/tracks/mini-store-admin.md): 관리 도구 하나를 계속 키우며 설계 변경을 관찰하는 장기 트랙
- [학습 아카이브](docs/roadmap/learning-archive.md): 쌓인 풀이 기록을 골라 카드형 사이트로 발행하는 계획

## 직접 실행하기

Node.js 24 이상과 pnpm 10 이상이 필요합니다.

`labs/code-quality`가 쓰는 Montage 디자인 시스템(`@wanteddev/wds`)은 GitHub Packages에서 받습니다. 설치 전에 `read:packages` 권한이 있는 GitHub 토큰을 환경 변수 `GITHUB_TOKEN`에 두고, `~/.npmrc`에 아래 두 줄을 추가합니다.

```ini
@wanteddev:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
pnpm install
pnpm dev:daily
```

변경을 올리기 전에는 CI와 같은 검사를 실행합니다. 모든 실습 패키지가 대상입니다.

```bash
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

## 더 읽을 거리

- [AGENTS.md](AGENTS.md): 모든 실습에 공통으로 적용하는 학습·협업 원칙
- [React 설계 학습 원칙](docs/principles/react-design.md)
- [React 설계 리뷰 체크리스트](docs/checklists/react-design-review.md)
- [Frontend Fundamentals 참고 기준](docs/references/frontend-fundamentals.md)
- [`.agents/skills`](.agents/skills): 풀이 기록의 질문과 멘토 리뷰를 쓰는 코치 스킬, 실습 문제를 출제하는 스킬
