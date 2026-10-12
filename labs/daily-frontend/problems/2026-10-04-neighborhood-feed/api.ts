import { createApiClient } from '../../src/api/client'

export const neighborhoods = { seongsu: '성수동', yeonnam: '연남동', mangwon: '망원동' } as const
export type Neighborhood = keyof typeof neighborhoods
export type Post = { id: string; title: string; price: number; neighborhood: Neighborhood }
export type LoadPosts = (neighborhood: Neighborhood) => Promise<Post[]>

export const examplePosts: Post[] = [
  { id: 's1', title: '주말에 읽기 좋은 에세이 두 권', price: 7000, neighborhood: 'seongsu' },
  { id: 's2', title: '작은 방에 두기 좋은 원목 책상', price: 35000, neighborhood: 'seongsu' },
]

// HTTP 응답 모킹은 handlers.ts에 두고 기존 함수 주입 계약을 유지한다.
export function createDemoLoader(): LoadPosts {
  const request = createApiClient()
  return (neighborhood) => request<Post[]>(`/api/daily/2026-10-04-neighborhood-feed/posts?neighborhood=${neighborhood}`)
}
