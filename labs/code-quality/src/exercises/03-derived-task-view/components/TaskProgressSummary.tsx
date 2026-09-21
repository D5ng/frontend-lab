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
      <FlexBox as="header" className="daily-task-intro" flexDirection="column">
        <Typography as="h1" id="daily-task-app-title" variant="title1" weight="bold">
          오늘도 차근차근
        </Typography>
      </FlexBox>

      <FlexBox as="section" aria-labelledby="daily-task-summary-title" className="daily-task-summary" flexDirection="column" gap="16px">
        <Typography as="h2" id="daily-task-summary-title" variant="title2" weight="bold">
          오늘 남은 일 {todoCount}개
        </Typography>
        <FlexBox alignItems="center" justifyContent="space-between" gap="16px">
          <Typography as="p" color="semantic.label.alternative" variant="label1">
            전체 {tasksTotalCount}개 중 {completedCount}개 완료
          </Typography>
          <Typography as="strong" className="daily-task-progress-copy" color="semantic.primary.normal" variant="heading2" weight="bold">
            {completionPercent}%
          </Typography>
        </FlexBox>
        <ProgressIndicator aria-label="오늘의 할 일 진행률" className="daily-task-progress-indicator" percent={completionPercent} />
      </FlexBox>
    </>
  )
}
