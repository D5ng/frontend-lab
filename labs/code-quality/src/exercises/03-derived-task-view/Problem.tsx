import { FlexBox, Typography } from '@wanteddev/wds'
import { DailyTask, DEFAULT_TASKS } from './model/task'
import { useDailyTasks } from './hooks/useDailyTasks'
import { TaskProgressSummary } from './components/TaskProgressSummary'
import { TaskList } from './components/TaskList'
import { TaskListControls } from './components/TaskListControls'
import { useState } from 'react'
import { filterVisibleTasks, TaskStatusFilter } from './model/filterVisibleTasks'

type ProblemProps = {
  initialTasks?: readonly DailyTask[]
}

export function Problem({ initialTasks = DEFAULT_TASKS }: ProblemProps) {
  const { tasks, todoCount, completedCount, completionPercent, toggleTask, deleteCompletedTasks, resultMessage } =
    useDailyTasks(initialTasks)

  // NOTE: 검색 및 조회 기능은 도메인이 아닌, UI에 어떻게 보여줄 것 인가에 대한 코드이기에 분리하지 않았다
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('ko-KR')
  const visibleTasks = filterVisibleTasks(tasks, statusFilter, normalizedQuery)

  return (
    <FlexBox className="daily-task-screen" flexDirection="column">
      <FlexBox alignItems="center" className="daily-task-topbar">
        <Typography as="span" className="daily-task-brand" variant="headline2" weight="bold">
          하루
        </Typography>
      </FlexBox>

      <TaskProgressSummary
        todoCount={todoCount}
        completedCount={completedCount}
        completionPercent={completionPercent}
        tasksTotalCount={tasks.length}
      />

      <FlexBox as="section" aria-labelledby="task-list-title" className="daily-task-content" flexDirection="column">
        <TaskListControls
          tasksTotalCount={tasks.length}
          todoCount={todoCount}
          completedCount={completedCount}
          deleteCompletedTasks={deleteCompletedTasks}
          searchQuery={searchQuery}
          onSearchQueryChange={(event) => setSearchQuery(event.currentTarget.value)}
          resetSearchQuery={() => setSearchQuery('')}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        <TaskList onToggleTask={toggleTask} visibleTasks={visibleTasks} />

        <Typography
          aria-live="polite"
          as="p"
          className="daily-task-result"
          color="semantic.primary.normal"
          variant="label1"
          weight="medium"
        >
          {resultMessage}
        </Typography>
      </FlexBox>
    </FlexBox>
  )
}
