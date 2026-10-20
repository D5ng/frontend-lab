import { SegmentedControl } from '@seed-design/react'
import { isNeighborhood, type Neighborhood, NEIGHBORHOODS } from './neighborhoodFeed.model'

interface Props {
  value: Neighborhood
  onValueChange: (value: Neighborhood) => void
}

export function NeighborhoodSelector({ value, onValueChange }: Props) {
  return (
    <SegmentedControl.Root
      value={value}
      aria-label="게시글 동네"
      className="feed-neighborhoods"
      onValueChange={(value) => {
        if (!isNeighborhood(value)) {
          return
        }

        onValueChange(value)
      }}
    >
      {Object.entries(NEIGHBORHOODS).map(([value, label]) => (
        <SegmentedControl.Item value={value} key={value} className="feed-neighborhood">
          <SegmentedControl.ItemHiddenInput />
          {label}
        </SegmentedControl.Item>
      ))}
      <SegmentedControl.Indicator />
    </SegmentedControl.Root>
  )
}
