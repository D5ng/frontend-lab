import { Button, Chip, FlexBox, SearchField, Typography } from '@wanteddev/wds'
import { IconTrash } from '@wanteddev/wds-icon'
import type { ChangeEventHandler } from 'react'
import type { TaskStatusFilter } from '../model/filterVisibleTasks'

const FILTER_LABELS: Record<TaskStatusFilter, string> = {
  all: '전체',
  todo: '할 일',
  completed: '완료',
}

interface Props {
  tasksTotalCount: number
  todoCount: number
  completedCount: number
  deleteCompletedTasks: () => void
  searchQuery: string
  onSearchQueryChange: ChangeEventHandler<HTMLInputElement>
  resetSearchQuery: () => void
  statusFilter: TaskStatusFilter
  onStatusFilterChange: (filter: TaskStatusFilter) => void
}

export function TaskListControls({
  tasksTotalCount,
  todoCount,
  completedCount,
  deleteCompletedTasks,
  searchQuery,
  onSearchQueryChange,
  resetSearchQuery,
  statusFilter,
  onStatusFilterChange,
}: Props) {
  return (
    <>
      <FlexBox alignItems="center" className="daily-task-section-heading" justifyContent="space-between" gap="12px">
        <Typography as="h2" id="task-list-title" variant="heading1" weight="bold">
          나의 할 일
        </Typography>
        <Button
          color="assistive"
          disabled={completedCount === 0}
          leadingContent={<IconTrash aria-hidden="true" height={16} width={16} />}
          onClick={deleteCompletedTasks}
          size="small"
          variant="outlined"
        >
          완료한 일 정리 {completedCount}
        </Button>
      </FlexBox>

      <SearchField
        aria-label="할 일 검색"
        className="daily-task-search"
        onChange={onSearchQueryChange}
        onReset={() => resetSearchQuery()}
        placeholder="할 일을 검색해 보세요"
        value={searchQuery}
        width="100%"
      />

      <FlexBox aria-label="할 일 상태 필터" className="daily-task-filters" flexWrap="wrap" gap="8px" role="group">
        {(Object.keys(FILTER_LABELS) as TaskStatusFilter[]).map((filter) => {
          const count = filter === 'all' ? tasksTotalCount : filter === 'todo' ? todoCount : completedCount

          return (
            <Chip
              active={statusFilter === filter}
              key={filter}
              onClick={() => onStatusFilterChange(filter)}
              size="small"
              variant="outlined"
            >
              {FILTER_LABELS[filter]} {count}
            </Chip>
          )
        })}
      </FlexBox>
    </>
  )
}
