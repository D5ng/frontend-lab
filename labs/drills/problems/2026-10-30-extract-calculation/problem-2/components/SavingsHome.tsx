import { Skeleton, VStack } from '@seed-design/react'
import type { ActivityComponentType } from '@stackflow/react'
import { ActionButton } from 'seed-design/ui/action-button'
import { AppBar, AppBarMain } from 'seed-design/ui/app-bar'
import { AppScreen, AppScreenContent } from 'seed-design/ui/app-screen'
import { Callout } from 'seed-design/ui/callout'
import { useProduct } from '../hooks/useProduct'
import { SavingsCalculator } from './SavingsCalculator'

export const SavingsHome: ActivityComponentType = () => {
  const { product, loadFailed, handleReload } = useProduct()

  if (!product) {
    return (
      <AppScreen>
        <AppBar>
          <AppBarMain title="적금 계산하기" />
        </AppBar>
        <AppScreenContent>
          {loadFailed ? (
            <VStack gap="x4" px="x5" py="x6">
              <Callout tone="critical" description="상품 정보를 불러오지 못했어요. 잠시 후 다시 불러와 주세요." />
              <ActionButton variant="neutralWeak" size="medium" onClick={handleReload}>
                다시 불러오기
              </ActionButton>
            </VStack>
          ) : (
            <VStack gap="x6" px="x5" py="x6" aria-busy="true" aria-label="상품 정보를 불러오는 중">
              <Skeleton height="x14" radius="8" />
              <Skeleton height="x10" radius="8" />
              <Skeleton height="x24" radius="8" />
            </VStack>
          )}
        </AppScreenContent>
      </AppScreen>
    )
  }

  return <SavingsCalculator product={product} />
}
