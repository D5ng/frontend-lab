import { useEffect, useState } from 'react'
import { problems } from './problems'

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
    <main>
      <h1>Daily Frontend</h1>
      <nav aria-label="실습 문제">
        {problems.map((item) => (
          <a key={item.id} href={`#${item.id}`} aria-current={item.id === problem.id ? 'page' : undefined}>
            {item.id.slice(0, 10)} · {item.title}
          </a>
        ))}
      </nav>
      <h2>{problem.title}</h2>
      <Component key={problem.id} />
    </main>
  )
}
