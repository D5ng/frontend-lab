import { useState } from 'react'
import { DailyTask } from '../model/task'

export function useDailyTasks(defaultTasks: readonly DailyTask[]) {
  const [tasks, setTasks] = useState<DailyTask[]>(() => [...defaultTasks])
  const [resultMessage, setResultMessage] = useState('')

  const todoCount = tasks.filter((task) => !task.completed).length
  const completedCount = tasks.length - todoCount
  const completionPercent = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100)

  const toggleTask = (taskId: string) => {
    setTasks((currentTasks) => currentTasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
    setResultMessage('')
  }

  const deleteCompletedTasks = () => {
    if (completedCount === 0) {
      return
    }

    setTasks((currentTasks) => currentTasks.filter((task) => !task.completed))
    setResultMessage(`완료한 할 일 ${completedCount}개를 정리했어요.`)
  }

  return {
    tasks,
    todoCount,
    completedCount,
    completionPercent,
    resultMessage,
    toggleTask,
    deleteCompletedTasks,
  }
}
