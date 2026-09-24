import { DailyTask } from './task'

export type TaskStatusFilter = 'all' | 'todo' | 'completed'

export function filterVisibleTasks(tasks: readonly DailyTask[], statusFilter: TaskStatusFilter, normalizedQuery: string) {
  return tasks.filter((task) => {
    const matchesStatus =
      statusFilter === 'all' || (statusFilter === 'todo' && !task.completed) || (statusFilter === 'completed' && task.completed)
    const matchesQuery = normalizedQuery.length === 0 || task.title.toLocaleLowerCase('ko-KR').includes(normalizedQuery)

    return matchesStatus && matchesQuery
  })
}
