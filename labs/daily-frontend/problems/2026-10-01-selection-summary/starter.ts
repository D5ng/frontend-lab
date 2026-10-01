type SavedProduct = {
  id: string
  name: string
  isSelected: boolean
}

type SelectionSummary = {
  selectedCount: number
  canDelete: boolean
}

export function getSelectionSummary(products: SavedProduct[]): SelectionSummary {
  // TODO: 선택 개수와 삭제 가능 여부를 계산해 반환하세요.
  return {
    selectedCount: 0,
    canDelete: false,
  }
}

export const exampleProducts: SavedProduct[] = [
  { id: 'keyboard', name: '키보드', isSelected: true },
  { id: 'mouse', name: '마우스', isSelected: false },
  { id: 'monitor', name: '모니터', isSelected: true },
]
