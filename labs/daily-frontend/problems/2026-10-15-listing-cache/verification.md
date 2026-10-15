# 출제 환경 검증 — 2026-10-15

## 범위

- 최신 `origin/develop`에서 별도 관리 worktree와 `feature/2026-10-15-listing-cache`를 만들었습니다.
- 원본 체크아웃, 관리 worktree 폴더들, origin/develop 트리, 원격 날짜 브랜치, 전체 PR에서 오늘 중복이 없음을 확인했습니다.
- 최근 미머지 출제 PR과 10/14 리팩터링형, 원본 10/04 풀이 기록을 읽고 직접 구현형으로 이어갑니다. 다른 미머지 PR 변경은 포함하지 않습니다.
- 오늘 폴더와 Daily README/문제 목록 한 항목만 변경합니다. 원본의 10/04 미커밋 풀이, 이전 문제, 개인 파일, 설정·lockfile·공식 스니펫은 보존합니다.

## 실행한 검사

| 검사                                                                 | 결과                                                            |
| -------------------------------------------------------------------- | --------------------------------------------------------------- |
| frozen install                                                       | 통과, lockfile 변경 없음, husky prepare 정상 실행               |
| `pnpm lint`                                                          | 두 Lab 통과                                                     |
| `pnpm format:check`                                                  | 두 Lab 통과                                                     |
| `pnpm test`                                                          | Daily **43 passed / 12 skipped**, code-quality **22 passed**    |
| 신규 제공 환경                                                       | UI 준비 검사 4개 + HTTP 검사 3개 통과                           |
| 신규 실습자 행동                                                     | **7개 의도적으로 skip**, 로직 미제공 상태이므로 통과시키지 않음 |
| `pnpm --filter @frontend-lab/daily-frontend exec tsc --noEmit`       | 통과                                                            |
| `pnpm build`                                                         | 두 Lab 타입 검사·Vite 빌드 통과                                 |
| `pnpm --filter @frontend-lab/daily-frontend exec seed-design compat` | **실패**, 아래 설명 참조                                        |

기존 10/04의 풀이 전 skip 5개도 그대로입니다. 신규 7개와 합해 12개입니다. “전체 테스트 명령 성공”은 직접 구현 완료를 뜻하지 않습니다.

## SEED 계약

- 설치된 React 2.5.1과 CSS 2.8.3을 사용합니다. React의 CSS peer ^2.8.0을 충족합니다.
- 공식 v2 RadioGroup/ActionButton 스니펫과 공개 Callout/Text/VStack 파츠 및 토큰을 사용합니다. RadioGroup은 Field 구조와 label·description·HiddenInput 연결을 포함합니다.
- 새 native 선택/버튼 대체나 신규 스니펫 설치·덮어쓰기는 없습니다. 레이아웃용 라디오 최소 높이만 공개 dimension-x12 토큰을 사용합니다.
- 전체 compat 검사는 **현재 registry의 ui:list가 CSS ^3.0.0을 요구**하여 종료 코드 1입니다. 오늘 새 화면은 List를 사용하지 않지만 기존 공통 스니펫을 포함한 검사를 숨기지 않습니다.
- 설치본의 peer 충족과 최신 registry 스니펫 호환 통과는 별개입니다. 패키지/스니펫 업그레이드는 범위 밖이므로 하지 않았으며 **Draft PR**로 제공합니다.

## 실제 375 × 812 브라우저 표현 검수

개발 서버의 공통 Daily 앱에서 기본 hash와 `listing-cache-preview`의 loading/error/success/unavailable 고정 입력 화면을 각각 열어 확인했습니다.

- 기본: 기본 물건 라디오 선택, 필드 이름/설명, 미구현 안내.
- 로딩: 현재 상품 제목과 진행 문구, 공식 로딩 버튼 disabled, 다른 선택 컨트롤은 enabled.
- 오류: critical 안내, 줄바꿈, 활성 재시도 버튼.
- 성공: 가격·동네·설명·완료 표시의 정보 계층.
- 거래 종료: 정상 null 안내와 다른 물건을 고르라는 다음 행동.
- **모든 상태**에서 innerWidth=375, 문서 scrollWidth=375. 라디오 label 행 343×48px, 주요 버튼 높이 52px.
- 공식 접근성 트리에서 그룹 이름과 각 라디오의 상품 이름, 선택 값, 버튼 이름/disabled를 확인했습니다. 준비 테스트에서 선택·재시도 콜백 연결도 확인했습니다.
- 상태별 스크린샷으로 내용 줄바꿈과 레이아웃을 확인했습니다. 종료 화면 article 하단 589px, 성공 화면 하단 642px로 812px 화면 안에 있고 고정 액션은 없습니다.
- 성공 미리보기 증빙: `/private/tmp/daily-oct15-success-preview.jpg`. 브라우저 error/warn 로그는 확인 시점에 없었습니다.

## 검증하지 않은 것

**실제 상품 전환·캐시 재사용·in-flight 중복 방지·오류 기억·재시도·늦은 응답 처리 흐름은 미구현이며 검증하지 않았습니다.** 미리보기는 고정 props이고 클릭해도 상태가 전이되지 않습니다. API 핸들러의 첫 실패/재시도와 null 응답 검사는 이 화면 로직과 별개입니다.

물리 기기·다른 브라우저·스크린리더 낭독·색 대비 정량 검사·원격 CI는 이 로컬 검증에 포함하지 않습니다. 정답을 작성해서 동작 검증을 대신하지 않았습니다.
