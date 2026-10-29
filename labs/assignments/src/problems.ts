import type { ComponentType } from 'react'

// 과제 폴더를 바로 찾는다. 등록 파일을 따로 두지 않아 동시에 열린 PR끼리 충돌하지 않는다.
// 과제는 폴더의 App.tsx에서 App을 내보내기만 지키면 그 아래 구조는 자유다.
const apps = import.meta.glob<{ App: ComponentType }>('../problems/*/App.tsx', { eager: true })
const documents = import.meta.glob<string>('../problems/*/problem.md', { query: '?raw', import: 'default', eager: true })

export type Assignment = { id: string; label: string; Component: ComponentType }

export const assignments: Assignment[] = Object.entries(apps)
  .map(([path, { App }]) => {
    const id = path.replace('../problems/', '').replace('/App.tsx', '')
    const title = readTitle(documents[path.replace('App.tsx', 'problem.md')])
    return { id, label: `${id.slice(5, 10).replace('-', '.')} · ${title}`, Component: App }
  })
  .sort((a, b) => b.id.localeCompare(a.id))

function readTitle(markdown = '') {
  return /^# (.+)$/m.exec(markdown)?.[1] ?? '제목 없음'
}
