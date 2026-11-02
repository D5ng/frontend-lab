import { VStack } from '@seed-design/react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function BottomActionBar({ children }: Props) {
  return (
    <VStack position="sticky" bottom={0} bg="bg.layerDefault" borderTopWidth={1} borderColor="stroke.neutralSubtle" px="x5" pt="x3" pb="x5">
      {children}
    </VStack>
  )
}
