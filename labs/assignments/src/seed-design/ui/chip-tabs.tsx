/**
 * @file ui:chip-tabs
 * @requires @seed-design/react@2.5.1 (SEED 저장소 @seed-design/react@2.5.1 태그에서 가져옴)
 **/

import { HStack, NotificationBadge, ChipTabs as SeedChipTabs } from '@seed-design/react'
import { forwardRef } from 'react'

export type ChipTabsRootProps = SeedChipTabs.RootProps

export const ChipTabsRoot = SeedChipTabs.Root

export type ChipTabsListProps = SeedChipTabs.ListProps

export const ChipTabsList = SeedChipTabs.List

export interface ChipTabsTriggerProps extends Omit<SeedChipTabs.TriggerProps, 'asChild'> {
  notification?: boolean
}

export const ChipTabsTrigger = forwardRef<HTMLButtonElement, ChipTabsTriggerProps>((props, ref) => {
  const { children, notification, ...otherProps } = props
  return (
    <SeedChipTabs.Trigger ref={ref} {...otherProps}>
      {notification ? (
        <HStack as="span" gap="x1_5">
          {children}
          <NotificationBadge size="small" />
        </HStack>
      ) : (
        children
      )}
    </SeedChipTabs.Trigger>
  )
})
ChipTabsTrigger.displayName = 'ChipTabsTrigger'

export type ChipTabsCarouselProps = Omit<SeedChipTabs.CarouselProps, 'asChild'>

export const ChipTabsCarousel = (props: ChipTabsCarouselProps) => {
  const { children, ...otherProps } = props
  return (
    <SeedChipTabs.Carousel {...otherProps}>
      <SeedChipTabs.CarouselCamera>{children}</SeedChipTabs.CarouselCamera>
    </SeedChipTabs.Carousel>
  )
}
ChipTabsCarousel.displayName = 'ChipTabsCarousel'

export type ChipTabsContentProps = SeedChipTabs.ContentProps

export const ChipTabsContent = SeedChipTabs.Content
