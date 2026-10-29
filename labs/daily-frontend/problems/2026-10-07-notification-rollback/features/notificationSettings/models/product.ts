import type { Delivery, Hour, NoticeResult, NotificationSaveResult, Product } from '../types/notification'

/* 화면에 보여질 상품을 가져온다 */
export function getVisibleProducts(products: Product[], query: string) {
  const keyword = query.trim().toLocaleLowerCase()
  if (keyword === '') {
    return products
  }

  // NOTE: 빈 문자열은 모든 문자열에 속한다
  return products.filter((product) => product.title.toLocaleLowerCase().includes(keyword))
}

/* 각 상품이 선택된 상품에 포함되는지 판별 */
export function getSelectedProduct(products: Product[], selectedIds: Product['id'][]) {
  return products.filter((product) => isSelected(selectedIds, product.id))
}

// 선택된 상품 목록에 상품이 포함되어 있는지
export function isSelected(selectedIds: Product['id'][], productId: Product['id']) {
  return selectedIds.includes(productId)
}

export const NOTICE_BY_RESULT: Record<NotificationSaveResult, NoticeResult> = {
  success: {
    tone: 'positive',
    role: 'status',
    message: '알림 설정을 저장했어요.',
  },
  failed: {
    tone: 'critical',
    role: 'alert',
    message: '알림을 저장하지 못했어요. 다시 시도해 주세요.',
  },
}

export function isDelivery(value: string): value is Delivery {
  return value === 'instant' || value === 'digest'
}

export function isHour(value: string): value is Hour {
  return value === '09' || value === '20'
}

export function getScheduleLabel(delivery: Delivery, hour: Hour) {
  if (delivery === 'instant') {
    return '가격이 내려가면 바로'
  }

  if (hour === '09') {
    return '매일 오전 9시에 한 번'
  }

  return '매일 오후 8시에 한 번'
}

export function formatProductTitles(selectedProducts: Product[]) {
  return selectedProducts.map((product) => product.title).join(', ')
}
