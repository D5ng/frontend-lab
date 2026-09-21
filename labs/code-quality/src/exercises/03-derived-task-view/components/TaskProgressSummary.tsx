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
      <FlexBox as="header" className="daily-task-intro" flexDirection="column" gap="6px">
        <Typography as="h1" id="daily-task-app-title" variant="title1" weight="bold">
          오늘도 차근차근
        </Typography>
        <Typography as="p" color="semantic.label.alternative" variant="body2-reading">
          생활 속 할 일을 한눈에 확인해요.
        </Typography>
      </FlexBox>

      <FlexBox as="section" aria-labelledby="daily-task-summary-title" className="daily-task-summary" flexDirection="column" gap="20px">
        <FlexBox alignItems="flex-end" justifyContent="space-between" gap="16px">
          <FlexBox flexDirection="column" gap="4px">
            <Typography as="h2" id="daily-task-summary-title" variant="heading2" weight="bold">
              오늘 남은 일 {todoCount}개
            </Typography>
            <Typography as="p" color="semantic.label.alternative" variant="label1">
              전체 {tasksTotalCount}개 중 {completedCount}개 완료
            </Typography>
          </FlexBox>
          <Typography as="strong" className="daily-task-progress-copy" color="semantic.primary.normal" variant="title3" weight="bold">
            {completionPercent}%
          </Typography>
        </FlexBox>
        <ProgressIndicator aria-label="오늘의 할 일 진행률" className="daily-task-progress-indicator" percent={completionPercent} />
      </FlexBox>
    </>
  )
}
