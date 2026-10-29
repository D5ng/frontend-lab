/**
 * @file ui:pull-to-refresh
 * @requires @seed-design/react@^2.0.0
 **/

import { PullToRefresh } from '@seed-design/react'
import { forwardRef } from 'react'
import { ProgressCircle } from './progress-circle'

export type PullToRefreshRootProps = PullToRefresh.RootProps

export const PullToRefreshRoot = PullToRefresh.Root

export type PullToRefreshIndicatorProps = Omit<PullToRefresh.IndicatorProps, 'children'>

export const PullToRefreshIndicator = forwardRef<HTMLDivElement, PullToRefreshIndicatorProps>(({ ...otherProps }, ref) => {
  return (
    <PullToRefresh.Indicator ref={ref} {...otherProps}>
      {(props) => <ProgressCircle size="24" tone="neutral" {...props} />}
    </PullToRefresh.Indicator>
  )
})

export type PullToRefreshContentProps = PullToRefresh.ContentProps

export const PullToRefreshContent = PullToRefresh.Content
