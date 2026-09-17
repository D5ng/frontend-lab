import { FlexBox, ProgressIndicator, TopNavigation, Typography } from '@wanteddev/wds'

import { Problem } from './exercises/02-draft-and-publish/Problem'

export function App() {
  return (
    <FlexBox as="main" className="mobile-event-app" flexDirection="column">
      <TopNavigation titleId="event-create-navigation-title">행사 만들기</TopNavigation>
      <ProgressIndicator aria-label="행사 만들기 진행 단계" aria-valuetext="2단계 중 1단계" percent={50} />

      <FlexBox className="page-shell" flexDirection="column" gap="32px">
        <FlexBox as="header" className="event-page-header" flexDirection="column" gap="8px">
          <Typography as="p" color="semantic.primary.normal" variant="label2" weight="bold">
            1 / 2 · 기본 정보
          </Typography>
          <Typography as="h1" id="event-create-title" variant="title1" weight="bold">
            어떤 행사를 만들까요?
          </Typography>
          <Typography as="p" color="semantic.label.alternative" variant="body2-reading">
            행사 유형과 참여 방법을 입력해 주세요. 작성 중인 내용은 임시 저장할 수 있어요.
          </Typography>
        </FlexBox>

        <Problem />
      </FlexBox>
    </FlexBox>
  )
}
