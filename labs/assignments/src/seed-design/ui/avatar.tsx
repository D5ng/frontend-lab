/**
 * @file ui:avatar
 * @requires @seed-design/react@2.5.1 (SEED 저장소 @seed-design/react@2.5.1 태그에서 가져옴)
 **/

import { Avatar as SeedAvatar } from '@seed-design/react'
import * as React from 'react'

export interface AvatarProps extends Omit<SeedAvatar.RootProps, 'asChild'> {
  src?: string

  alt?: string

  fallback?: React.ReactNode
}

/**
 * @see https://seed-design.io/react/components/avatar
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({ src, alt, fallback, children, ...otherProps }, ref) => {
  return (
    <SeedAvatar.Root ref={ref} {...otherProps}>
      <SeedAvatar.Fallback>{fallback}</SeedAvatar.Fallback>
      <SeedAvatar.Image src={src} alt={alt} />
      {children}
    </SeedAvatar.Root>
  )
})
Avatar.displayName = 'Avatar'

export type AvatarBadgeProps = SeedAvatar.BadgeProps

export const AvatarBadge = SeedAvatar.Badge

export type AvatarStackProps = SeedAvatar.StackProps

export const AvatarStack = SeedAvatar.Stack
