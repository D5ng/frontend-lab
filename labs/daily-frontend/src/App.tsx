import { useEffect, useState } from 'react'
import { Badge, Text } from '@seed-design/react'
import { problems } from './problems'
import { SelectRoot, SelectTrigger, SelectContent, SelectGroup, SelectItem } from 'seed-design/ui/select'

function getProblemId() {
  return window.location.hash.slice(1)
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

  const problem = problems.find((item) => item.id === problemId) ?? problems[0]!
  const { Component } = problem

  return (
    <main className="daily-app">
      <header className="daily-header">
        <Text as="h1" textStyle="t5Bold">
          Daily Frontend
        </Text>
        <Badge variant="weak" tone="brand" size="medium">
          매일 한 문제
        </Badge>
      </header>
      <nav className="daily-selector" aria-label="실습 문제">
        <SelectRoot
          label="실습 문제"
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
                <SelectItem key={item.id} value={item.id} label={`${item.id.slice(5, 10).replace('-', '.')} · ${item.title}`} />
              ))}
            </SelectGroup>
          </SelectContent>
        </SelectRoot>
      </nav>
      <div className="daily-content">
        <Component key={problem.id} />
      </div>
    </main>
  )
}
