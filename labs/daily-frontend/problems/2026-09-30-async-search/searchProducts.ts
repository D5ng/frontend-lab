const products = [
  { id: 'macbook-air', name: '맥북 에어' },
  { id: 'macbook-pro', name: '맥북 프로' },
  { id: 'mac-mini', name: '맥 미니' },
  { id: 'imac', name: '아이맥' },
  { id: 'iphone', name: '아이폰' },
  { id: 'ipad', name: '아이패드' },
]

export function searchProducts(query: string): Promise<typeof products> {
  // 짧은 검색어의 응답을 늦춰 이전 결과가 뒤늦게 도착하는 상황을 만든다.
  const delay = query.length === 1 ? 2000 : 600
  return new Promise((resolve) => {
    setTimeout(() => resolve(products.filter((product) => product.name.includes(query))), delay)
  })
}
