import { Badge, Text } from '@seed-design/react'
import { useEffect, useState } from 'react'
import { SelectContent, SelectGroup, SelectItem, SelectRoot, SelectTrigger } from 'seed-design/ui/select'
import { problems } from './problems'

function getProblemId() {
  return decodeURIComponent(window.location.hash.slice(1))
}

export function App() {
  const [problemId, setProblemId] = useState(getProblemId)

  useEffect(() => {
    function handleHashChange() {
      setProblemId(getProblemId())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const problem = problems.find((item) => item.id === problemId) ?? problems[0]

  return (
    <main className="lab-app">
      <header className="lab-header">
        <Text as="h1" textStyle="t5Bold">
          Drills
        </Text>
        <Badge variant="weak" tone="brand" size="medium">
          하루에 기법 하나
        </Badge>
      </header>
      {problem ? (
        <>
          <nav className="lab-selector" aria-label="드릴 문제">
            <SelectRoot
              label="드릴 문제"
              value={[problem.id]}
              onValueChange={(values) => {
                if (values[0]) window.location.hash = values[0]
              }}
              size="medium"
            >
              <SelectTrigger />
              <SelectContent>
                <SelectGroup>
                  {problems.map((item) => (
                    <SelectItem key={item.id} value={item.id} label={item.label} />
                  ))}
                </SelectGroup>
              </SelectContent>
            </SelectRoot>
          </nav>
          <div className="app-frame">
            <problem.Component key={problem.id} />
          </div>
        </>
      ) : (
        <p className="lab-empty">아직 화면이 있는 드릴 문제가 없어요.</p>
      )}
    </main>
  )
}
