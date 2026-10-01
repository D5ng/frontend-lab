import { vi } from 'vitest'

// jsdom은 레이아웃을 계산하지 않는다. SEED의 누름 피드백 측정에만 쓰이는
// 브라우저 API를 보완하고 주문 행동은 실제 컴포넌트로 검증한다.
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
