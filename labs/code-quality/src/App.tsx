import { Problem } from "./exercises/01-separate-exclusive-code/Problem";

export function App() {
  return (
    <main className="page-shell">
      <header className="intro">
        <p className="eyebrow">Frontend Code Quality Lab · Exercise 01</p>
        <h1>같이 실행되지 않는 코드 분리하기</h1>
        <p>
          동작을 유지하면서 배달과 픽업 흐름의 책임을 어떻게 나눌지 직접 판단해
          보세요. 정답 구조는 제공하지 않습니다.
        </p>
      </header>

      <Problem />
    </main>
  );
}
