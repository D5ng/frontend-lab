/**
 * @file ui:reaction-button
 * @requires @seed-design/react@2.5.1 (SEED 저장소 @seed-design/react@2.5.1 태그에서 가져옴)
 **/

import { ReactionButton as SeedReactionButton, type ReactionButtonProps as SeedReactionButtonProps } from '@seed-design/react'
import * as React from 'react'
import { LoadingIndicator } from './loading-indicator'

export type ReactionButtonProps = SeedReactionButtonProps

/**
 * @see https://seed-design.io/react/components/reaction-button
 * If `asChild` is enabled, manual handling of `LoadingIndicator` is required.
 */
export const ReactionButton = React.forwardRef<React.ElementRef<typeof SeedReactionButton>, ReactionButtonProps>(
  ({ loading = false, children, ...otherProps }, ref) => {
    return (
      <SeedReactionButton ref={ref} loading={loading} {...otherProps}>
        {loading && !otherProps.asChild ? <LoadingIndicator>{children}</LoadingIndicator> : children}
      </SeedReactionButton>
    )
  },
)
ReactionButton.displayName = 'ReactionButton'

/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
