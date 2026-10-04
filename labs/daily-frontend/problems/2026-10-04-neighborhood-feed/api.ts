export const neighborhoods = { seongsu: '성수동', yeonnam: '연남동', mangwon: '망원동' } as const
export type Neighborhood = keyof typeof neighborhoods
export type Post = { id: string; title: string; price: number; neighborhood: Neighborhood }
export type LoadPosts = (neighborhood: Neighborhood) => Promise<Post[]>

export const examplePosts: Post[] = [
  { id: 's1', title: '주말에 읽기 좋은 에세이 두 권', price: 7000, neighborhood: 'seongsu' },
  { id: 's2', title: '작은 방에 두기 좋은 원목 책상', price: 35000, neighborhood: 'seongsu' },
]

// 취소를 지원하지 않는 모의 서버입니다. UI의 요청 수명 관리는 구현하지 않습니다.
export function createDemoLoader(): LoadPosts {
  let yeonnamCalls = 0
  return async (neighborhood) => {
    const fail = neighborhood === 'yeonnam' && ++yeonnamCalls === 1
    const delay = neighborhood === 'seongsu' ? 1800 : neighborhood === 'yeonnam' ? 450 : 700
    await new Promise<void>((resolve) => setTimeout(resolve, delay))
    if (fail) throw new Error('temporary failure')
    if (neighborhood === 'mangwon') return []
    if (neighborhood === 'seongsu') return examplePosts.map((post) => ({ ...post }))
    return [{ id: 'y1', title: '산책할 때 쓰기 좋은 작은 크로스백', price: 12000, neighborhood }]
  }
}
