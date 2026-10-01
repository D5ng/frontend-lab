/* eslint-disable react-hooks/set-state-in-effect -- 비동기 검색 버그를 분석하기 위한 실습 초기 코드 */
import { useEffect, useState } from 'react'
import { Badge, HStack, Text, VStack } from '@seed-design/react'
import { IconMagnifyingglassLine } from '@karrotmarket/react-monochrome-icon'
import { TextField, TextFieldInput } from '../../src/seed-design/ui/text-field'
import { List, ListItem } from '../../src/seed-design/ui/list'
import { ContentPlaceholder } from '../../src/seed-design/ui/content-placeholder'
import { ProgressCircle } from '../../src/seed-design/ui/progress-circle'
import './style.css'

type Product = {
  id: string
  name: string
}

type ProductSearchProps = {
  searchProducts: (query: string) => Promise<Product[]>
}

export function ProductSearch({ searchProducts }: ProductSearchProps) {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!query) {
      setProducts([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    searchProducts(query)
      .then((result) => {
        setProducts(result)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [query, searchProducts])

  return (
    <VStack as="section" className="async-search" aria-label="상품 검색" gap="x6" px="x5" py="x6">
      <VStack gap="x2">
        <Badge variant="weak" tone="brand" size="medium" style={{ alignSelf: 'flex-start' }}>
          상품 찾기
        </Badge>
        <Text as="h2" textStyle="t7Bold">
          어떤 상품을 찾으세요?
        </Text>
        <Text as="p" textStyle="t4Regular" color="fg.neutralSubtle">
          상품 이름을 입력하면 검색 결과를 보여드려요.
        </Text>
      </VStack>

      <TextField label="상품 검색어" prefixIcon={<IconMagnifyingglassLine />}>
        <TextFieldInput
          id="product-query"
          placeholder="맥북, 아이폰, 아이패드 검색"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </TextField>

      <VStack gap="x3" aria-busy={isLoading}>
        <HStack justify="space-between" align="center">
          <Text as="h3" textStyle="t5Bold">
            검색 결과
          </Text>
          {!isLoading && query && (
            <Badge variant="weak" tone="neutral" size="medium">
              {products.length}개
            </Badge>
          )}
        </HStack>

        <div role="status" aria-live="polite">
          {isLoading && (
            <HStack gap="x2" py="x3">
              <ProgressCircle size="24" tone="brand" aria-hidden="true" />
              <Text textStyle="t4Regular" color="fg.neutralSubtle">
                검색 중...
              </Text>
            </HStack>
          )}
          {!query && (
            <VStack gap="x2" align="center" px="x2" py="x10" className="async-search-empty">
              <IconMagnifyingglassLine className="async-search-empty-icon" aria-hidden="true" />
              <Text textStyle="t5Bold">찾고 싶은 상품을 검색해 보세요</Text>
              <Text textStyle="t4Regular" color="fg.neutralSubtle">
                맥북, 아이폰, 아이패드로 시작해 보세요.
              </Text>
            </VStack>
          )}
          {query && !isLoading && products.length === 0 && (
            <VStack gap="x2" align="center" px="x2" py="x10" className="async-search-empty">
              <IconMagnifyingglassLine className="async-search-empty-icon" aria-hidden="true" />
              <Text textStyle="t5Bold">검색 결과가 없어요</Text>
              <Text textStyle="t4Regular" color="fg.neutralSubtle">
                다른 상품 이름으로 검색해 보세요.
              </Text>
            </VStack>
          )}
        </div>

        <List aria-label="검색된 상품" width="full">
          {products.map((product) => (
            <ListItem
              key={product.id}
              title={product.name}
              prefix={<ContentPlaceholder aria-hidden="true" style={{ width: 64, height: 64, borderRadius: 'var(--seed-radius-r3)' }} />}
            />
          ))}
        </List>
      </VStack>
    </VStack>
  )
}
