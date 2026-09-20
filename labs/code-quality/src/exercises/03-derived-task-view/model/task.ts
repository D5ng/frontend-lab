export type DailyTask = {
  id: string
  title: string
  category: 'home' | 'health' | 'shopping' | 'personal'
  due: string
  place: string
  completed: boolean
}

/* 할 일 목록의 기본 정보 */
export const DEFAULT_TASKS: readonly DailyTask[] = [
  {
    id: 'recycling',
    title: '분리수거함 내놓기',
    category: 'home',
    due: '오늘 오후 8시',
    place: '우리 집',
    completed: false,
  },
  {
    id: 'vaccination',
    title: '반려견 예방접종 예약',
    category: 'health',
    due: '내일 오전 10시',
    place: '봄빛동물병원',
    completed: false,
  },
  {
    id: 'laundry',
    title: '세탁소에서 겨울 이불 찾기',
    category: 'home',
    due: '오늘 오후 6시',
    place: '햇살세탁소',
    completed: true,
  },
  {
    id: 'groceries',
    title: '주말 장보기 목록 정리',
    category: 'shopping',
    due: '토요일 오전',
    place: '동네 마트',
    completed: true,
  },
]
