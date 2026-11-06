import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from '../mocks/server'

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
// vitest globals를 쓰지 않아 Testing Library가 렌더링을 스스로 치우지 못한다. 테스트마다 화면을 비운다.
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close())

// Stackflow는 화면을 넘기면 전환이 끝날 때까지(문제마다 transitionDuration 350ms) 짧은 간격의 타이머로 상태를 다시 본다.
// 파일의 마지막 테스트가 그 사이에 끝나면 vitest가 jsdom을 먼저 치우고, 남은 타이머가 사라진 Element를 읽다가
// "Element is not defined"를 낸다. 테스트는 모두 통과해도 CI가 실패한다. 파일을 닫기 전에 전환보다 조금 더 기다려
// 타이머가 스스로 멈추게 한다.
const STACKFLOW_SETTLE_MS = 500
afterAll(() => new Promise((resolve) => setTimeout(resolve, STACKFLOW_SETTLE_MS)))

// jsdom은 레이아웃을 계산하지 않는다. SEED의 누름 피드백 측정에만 쓰이는
// 브라우저 API를 보완하고 행동은 실제 컴포넌트로 검증한다.
vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {
      /* jsdom에는 요소 크기 변화가 없다. */
    }
    unobserve() {
      /* 관찰한 요소가 없다. */
    }
    disconnect() {
      /* 관찰한 요소가 없다. */
    }
  },
)

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})

// jsdom에는 Web Animations API가 없다. SEED 앱 화면은 화면을 넘길 때 el.animate()로 움직이므로,
// 바로 끝나는 애니메이션을 돌려줘 이동만 검증한다.
Element.prototype.animate = function () {
  return { finished: Promise.resolve(), cancel: vi.fn(), commitStyles: vi.fn(), onfinish: null, oncancel: null } as unknown as Animation
}

// jsdom에는 포인터 캡처가 없다. SEED 바텀시트는 누르는 순간 끌어내리기를 준비하며 이 API를 부른다.
Element.prototype.setPointerCapture = vi.fn()
Element.prototype.releasePointerCapture = vi.fn()
Element.prototype.hasPointerCapture = () => false
