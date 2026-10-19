import type { Page } from '../types/feed'

export const demoPages: Record<string, Page> = {
  start: {
    items: [
      { id: 'chair', title: '접이식 의자 나눔해요', location: '성수동 · 오늘' },
      { id: 'books', title: '읽은 책 세 권 가져가세요', location: '성수동 · 오늘' },
    ],
    nextCursor: 'next-1',
  },
  'next-1': {
    items: [
      { id: 'books', title: '읽은 책 세 권 가져가세요', location: '성수동 · 오늘' },
      { id: 'cups', title: '머그컵 두 개 나눔해요', location: '성수동 · 어제' },
    ],
    nextCursor: 'next-2',
  },
  'next-2': { items: [{ id: 'plant', title: '작은 화분을 나눔해요', location: '성수동 · 어제' }], nextCursor: null },
}
