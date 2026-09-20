import { FlexBox, ProgressIndicator, Typography } from '@wanteddev/wds'

interface Props {
  todoCount: number
  tasksTotalCount: number
  completionPercent: number
  completedCount: number
}

export function TaskProgressSummary({ todoCount, completedCount, completionPercent, tasksTotalCount }: Props) {
  return (
    <>
      <FlexBox as="header" className="daily-task-intro" flexDirection="column" gap="4px">
        <Typography as="p" color="semantic.label.alternative" variant="label2" weight="medium">
          9월 18일 목요일
        </Typography>
        <Typography as="h1" id="daily-task-app-title" variant="title1" weight="bold">
          오늘도 차근차근
        </Typography>
        <Typography as="p" color="semantic.label.alternative" variant="body2-reading">
          잊기 쉬운 생활 약속을 한곳에 모아뒀어요.
        </Typography>
      </FlexBox>

      <FlexBox as="section" aria-labelledby="daily-task-summary-title" className="daily-task-summary" flexDirection="column" gap="16px">
        <FlexBox alignItems="flex-end" justifyContent="space-between" gap="16px">
          <FlexBox flexDirection="column" gap="4px">
            <Typography as="h2" id="daily-task-summary-title" variant="heading2" weight="bold">
              오늘 남은 일 {todoCount}개
            </Typography>
            <Typography as="p" color="semantic.label.alternative" variant="label1">
              할 수 있는 만큼, 하나씩 해봐요.
            </Typography>
          </FlexBox>
          <FlexBox alignItems="baseline" className="daily-task-progress-copy" gap="4px">
            <Typography as="strong" color="semantic.primary.normal" variant="title3" weight="bold">
              {completionPercent}%
            </Typography>
            <Typography as="span" color="semantic.label.alternative" variant="caption1">
              {completedCount}/{tasksTotalCount} 완료
            </Typography>
          </FlexBox>
        </FlexBox>
        <ProgressIndicator aria-label="오늘의 할 일 진행률" className="daily-task-progress-indicator" percent={completionPercent} />
      </FlexBox>
    </>
  )
}
