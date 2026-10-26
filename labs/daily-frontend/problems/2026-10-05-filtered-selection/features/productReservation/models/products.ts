import type { Product, ProductFilter } from '../types/reservation'

/* 모든 상품을 보여줄지 판별하는 함수 */
export function isProductVisible(selectedFilter: ProductFilter, product: Product) {
  return selectedFilter === 'all' || isFreeProduct(product)
}

/* 상품이 무료인지 판별하는 함수 */
export function isFreeProduct(product: Product) {
  return product.price === 0
}

/* 각 상품이 내가 선택한 상품 목록에 있는지를 판별하여 가져오는 함수 */
export function getSelectedProducts(products: Product[], selectedIds: Product['id'][]) {
  return products.filter((product) => isSelectedProduct(product.id, selectedIds))
}

/* 상품이 선택된 상품에 포함하는지 판별하는 함수 */
export function isSelectedProduct(productId: Product['id'], selectedIds: Product['id'][]) {
  return selectedIds.includes(productId)
}

/* 숨견진 상품 중에서 내가 선택한 상품을 가져오는 함수 */
export function getHiddenSelectedProducts(products: Product[], selectedIds: Product['id'][], filter: ProductFilter) {
  return getSelectedProducts(products, selectedIds).filter((product) => !isProductVisible(filter, product))
}

/* 선택된 필터에 따라 상품을 보여준다 */
export function getVisibleProducts(products: Product[], selectedFilter: ProductFilter) {
  return products.filter((product) => isProductVisible(selectedFilter, product))
}
