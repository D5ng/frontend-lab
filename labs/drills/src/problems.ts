import type { ComponentType } from 'react'

// 문제 화면을 폴더에서 바로 찾는다. 등록 파일을 따로 두지 않아 동시에 열린 PR끼리 충돌하지 않는다.
// 문제 1처럼 화면 없이 함수만 다루는 문제는 Problem.tsx가 없으므로 목록에 나오지 않는다.
const screens = import.meta.glob<{ Problem: ComponentType }>('../problems/*/problem-*/Problem.tsx', { eager: true })
const documents = import.meta.glob<string>('../problems/*/problem-*/problem.md', { query: '?raw', import: 'default', eager: true })

export type DrillProblem = { id: string; label: string; Component: ComponentType }

export const problems: DrillProblem[] = Object.entries(screens)
  .map(([path, { Problem }]) => {
    const id = path.replace('../problems/', '').replace('/Problem.tsx', '')
    const [day = '', step = ''] = id.split('/')
    const title = readTitle(documents[path.replace('Problem.tsx', 'problem.md')])
    return { id, label: `${formatDay(day)} · 문제 ${step.replace('problem-', '')} · ${title}`, Component: Problem }
  })
  .sort(newestDayFirst)

function newestDayFirst(a: DrillProblem, b: DrillProblem) {
  const [dayA = ''] = a.id.split('/')
  const [dayB = ''] = b.id.split('/')
  return dayA === dayB ? a.id.localeCompare(b.id) : dayB.localeCompare(dayA)
}

function formatDay(folder: string) {
  return folder.slice(5, 10).replace('-', '.')
}

function readTitle(markdown = '') {
  return /^# (.+)$/m.exec(markdown)?.[1] ?? '제목 없음'
}
