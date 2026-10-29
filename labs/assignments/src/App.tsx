import { Badge, Text } from '@seed-design/react'
import { useEffect, useState } from 'react'
import { SelectContent, SelectGroup, SelectItem, SelectRoot, SelectTrigger } from 'seed-design/ui/select'
import { assignments } from './problems'

function getAssignmentId() {
  return decodeURIComponent(window.location.hash.slice(1))
}

export function App() {
  const [assignmentId, setAssignmentId] = useState(getAssignmentId)

  useEffect(() => {
    function handleHashChange() {
      setAssignmentId(getAssignmentId())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const assignment = assignments.find((item) => item.id === assignmentId) ?? assignments[0]

  return (
    <main className="lab-app">
      <header className="lab-header">
        <Text as="h1" textStyle="t5Bold">
          Assignments
        </Text>
        <Badge variant="weak" tone="brand" size="medium">
          페이지 하나를 끝까지
        </Badge>
      </header>
      {assignment ? (
        <>
          <nav className="lab-selector" aria-label="과제">
            <SelectRoot
              label="과제"
              value={[assignment.id]}
              onValueChange={(values) => {
                if (values[0]) window.location.hash = values[0]
              }}
              size="medium"
            >
              <SelectTrigger />
              <SelectContent>
                <SelectGroup>
                  {assignments.map((item) => (
                    <SelectItem key={item.id} value={item.id} label={item.label} />
                  ))}
                </SelectGroup>
              </SelectContent>
            </SelectRoot>
          </nav>
          <div className="app-frame">
            <assignment.Component key={assignment.id} />
          </div>
        </>
      ) : (
        <p className="lab-empty">아직 낸 과제가 없어요.</p>
      )}
    </main>
  )
}
