import { FlexBox, ProgressIndicator, Typography } from '@wanteddev/wds'

interface Props {
  todoCount: number
  tasksTotalCount: number
  completionPercent: number
  completedCount: number
}

export function TaskProgressSummary({ todoCount, completedCount, completionPercent, tasksTotalCount }: Props) {
  return (
    <FlexBox as="header" className="daily-task-summary" flexDirection="column">
      <Typography as="h1" id="daily-task-app-title" variant="title1" weight="bold">
        오늘 남은 일 {todoCount}개
      </Typography>
      <Typography as="p" className="daily-task-summary-detail" color="semantic.label.alternative" variant="body2">
        전체 {tasksTotalCount}개 중 {completedCount}개 완료
      </Typography>
      <FlexBox alignItems="center" className="daily-task-progress" gap="16px">
        <ProgressIndicator aria-label="오늘의 할 일 진행률" className="daily-task-progress-indicator" percent={completionPercent} />
        <Typography as="strong" className="daily-task-progress-copy" color="semantic.primary.normal" variant="heading2" weight="bold">
          {completionPercent}%
        </Typography>
      </FlexBox>
    </FlexBox>
  )
}
