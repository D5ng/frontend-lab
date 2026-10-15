import type { DetailViewProps } from './view'

// 표현 검수용 고정 입력이다. 요청·캐시·상태 전이를 구현하지 않는다.
export const previews: Record<string, Omit<DetailViewProps, 'onSelect' | 'onRetry'>> = {
  loading: { selectedId: 'chair', detail: undefined, busy: true, error: '' },
  error: { selectedId: 'lamp', detail: undefined, busy: false, error: '상세를 불러오지 못했어요. 다시 시도해 주세요.' },
  success: {
    selectedId: 'chair',
    detail: { id: 'chair', price: 15000, description: '접어서 보관할 수 있어요. 성수역에서 직거래해요.', neighborhood: '성수동' },
    busy: false,
    error: '',
  },
  unavailable: { selectedId: 'mug', detail: null, busy: false, error: '' },
}
