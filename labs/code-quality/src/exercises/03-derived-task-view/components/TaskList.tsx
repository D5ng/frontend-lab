import { CheckMark, FlexBox, Typography } from '@wanteddev/wds'
import { DailyTask } from '../model/task'
import { IconSearch } from '@wanteddev/wds-icon'

interface Props {
  visibleTasks: DailyTask[]
  onToggleTask: (taskId: string) => void
}

const CATEGORY_LABELS: Record<DailyTask['category'], string> = {
  health: '건강',
  home: '생활',
  personal: '개인',
  shopping: '장보기',
}

export function TaskList({ visibleTasks, onToggleTask }: Props) {
  return visibleTasks.length > 0 ? (
    <FlexBox as="ul" className="daily-task-list" flexDirection="column">
      {visibleTasks.map((task) => (
        <FlexBox as="li" alignItems="center" className="daily-task-item" data-completed={task.completed} gap="10px" key={task.id}>
          <CheckMark
            aria-label={task.completed ? `${task.title} 미완료로 되돌리기` : `${task.title} 완료로 표시`}
            checked={task.completed}
            onCheckedChange={() => onToggleTask(task.id)}
            size="medium"
          />

          <FlexBox className="daily-task-item-body" flexDirection="column" gap="4px">
            <FlexBox alignItems="flex-start" justifyContent="space-between" gap="8px">
              <Typography as="h3" className="daily-task-title" variant="body1" weight="medium">
                {task.title}
              </Typography>
              <Typography as="span" className="daily-task-category" color="semantic.label.alternative" variant="caption1">
                {CATEGORY_LABELS[task.category]}
              </Typography>
            </FlexBox>
            <FlexBox className="daily-task-metadata" flexWrap="wrap" gap="4px 10px">
              <Typography as="span" color="semantic.label.alternative" variant="caption1">
                {task.due}
              </Typography>
              <Typography as="span" color="semantic.label.alternative" variant="caption1">
                {task.place}
              </Typography>
            </FlexBox>
          </FlexBox>
        </FlexBox>
      ))}
    </FlexBox>
  ) : (
    <FlexBox alignItems="center" className="daily-task-empty" flexDirection="column" justifyContent="center" gap="8px">
      <FlexBox alignItems="center" aria-hidden="true" className="daily-task-empty-icon" justifyContent="center">
        <IconSearch height={22} width={22} />
      </FlexBox>
      <Typography as="strong" variant="body1" weight="bold">
        조건에 맞는 할 일이 없어요
      </Typography>
      <Typography as="p" color="semantic.label.alternative" variant="body2">
        검색어나 필터를 바꿔 보세요.
      </Typography>
    </FlexBox>
  )
}
