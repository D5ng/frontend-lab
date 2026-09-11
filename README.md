# frontend-lab

React 코드를 만들고 변경하면서 상태, 책임, 응집도와 결합도를 판단하는 과정을 기록하는 학습 저장소입니다.

## 저장소 구성

```text
labs/       하나의 질문을 짧게 검증하는 실험
projects/   요구사항을 누적하며 확장하는 장기 프로젝트(추후 생성)
apps/       학습 결과를 보여주는 애플리케이션(추후 생성)
packages/   실제 공통 변경 이유가 확인된 공유 패키지(필요할 때 생성)
docs/       원칙, 리뷰 체크리스트, 학습 트랙과 로드맵
.agents/    저장소에서 사용하는 학습·리뷰 스킬
```

현재 활성 패키지는 [`labs/code-quality`](./labs/code-quality/README.md) 하나입니다. Mini Store Admin과 학습 아카이브는 문서로만 계획하며, 해당 단계를 시작할 때 독립 workspace package로 생성합니다.

## 시작하기

```bash
pnpm install
pnpm dev
```

## 검증 명령

```bash
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

각 명령은 현재 `@frontend-lab/code-quality` 패키지를 대상으로 실행됩니다. 패키지가 늘어나면 실제 반복 비용을 확인한 후 실행 전략과 Turborepo 도입 여부를 다시 판단합니다.

## 학습 기록

실습 중의 생각과 변경 기록은 각 패키지의 `notes/`에 둡니다. 공개할 가치가 있는 기록만 추후 학습 아카이브의 MDX로 다듬어 발행합니다.
