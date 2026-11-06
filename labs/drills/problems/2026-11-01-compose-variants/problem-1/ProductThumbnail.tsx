import type { ReactNode } from 'react'

interface Props {
  name: string
  imageUrl: string
  children: ReactNode
}

export function ProductThumbnail({ name, imageUrl, children }: Props) {
  return (
    <div>
      <img src={imageUrl} alt={name} />
      {children}
    </div>
  )
}
