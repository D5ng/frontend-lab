export type Neighborhood = keyof typeof NEIGHBORHOODS
export type Post = { id: string; title: string; price: number; neighborhood: Neighborhood }
export type LoadPosts = (neighborhood: Neighborhood) => Promise<Post[]>

export const NEIGHBORHOODS = { seongsu: '성수동', yeonnam: '연남동', mangwon: '망원동' } as const

export const NEIGHBORHOOS_ERROR_MESSAGE = '게시글을 불러오지 못했어요. 다시 불러오거나 다른 동네를 골라 주세요.'

export function isNeighborhood(value: string): value is Neighborhood {
  return Object.entries(NEIGHBORHOODS).some(([neighborhood]) => neighborhood === value)
}
