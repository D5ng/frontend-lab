import { delay, http, HttpResponse } from 'msw'

// 모의 서버다. 풀이 대상이 아니다.
const BASE = '/api/drills/2026-11-01'

// 사진 대신 색만 칠한 그림을 준다. 네트워크 없이도 화면과 테스트가 같게 돈다.
function photo(color: string) {
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="${color}"/></svg>`)}`
}

const people = {
  minji: { name: '김민지', profileImageUrl: photo('#f7b267') },
  seoyeon: { name: '이서연', profileImageUrl: photo('#8ecae6') },
  doyun: { name: '최도윤', profileImageUrl: photo('#b5e48c') },
  harin: { name: '정하린', profileImageUrl: photo('#cdb4db') },
  junho: { name: '박준호', profileImageUrl: photo('#ffafcc') },
}

export const inbox = {
  now: '2026-11-01T09:00:00+09:00',
  notifications: [
    {
      id: 1,
      type: 'comment',
      createdAt: '2026-11-01T08:57:00+09:00',
      read: false,
      actor: people.minji,
      comment: {
        id: 501,
        text: '다음엔 저도 같이 뛰어요! 반포에서 출발하는 코스도 공유해 주실 수 있나요? 주말마다 혼자 뛰기 심심했거든요.',
        likedByMe: false,
      },
    },
    {
      id: 2,
      type: 'like',
      createdAt: '2026-11-01T07:00:00+09:00',
      read: false,
      actors: [people.minji, people.seoyeon, people.doyun, people.harin],
      postTitle: '토요일 아침 한강 러닝 후기',
    },
    {
      id: 3,
      type: 'invite',
      createdAt: '2026-10-31T08:10:00+09:00',
      read: true,
      inviter: people.junho,
      group: { name: '주말 러닝 크루', imageUrl: photo('#90be6d'), memberCount: 24 },
      status: 'pending',
    },
    {
      id: 4,
      type: 'like',
      createdAt: '2026-10-30T09:00:00+09:00',
      read: true,
      actors: [people.seoyeon],
      postTitle: '망원동 저녁 산책 같이 해요',
    },
    {
      id: 5,
      type: 'invite',
      createdAt: '2026-10-28T19:00:00+09:00',
      read: true,
      inviter: people.harin,
      group: { name: '망원 책 읽는 밤', imageUrl: photo('#577590'), memberCount: 12 },
      status: 'accepted',
    },
    {
      id: 6,
      type: 'scheduleChanged',
      createdAt: '2026-10-27T21:00:00+09:00',
      read: true,
      group: { name: '망원 책 읽는 밤' },
      before: '2026-11-06T19:30:00+09:00',
      after: '2026-11-07T19:30:00+09:00',
    },
  ],
}

export const handlers = [
  http.get(`${BASE}/notifications`, async () => {
    await delay()
    return HttpResponse.json(inbox)
  }),

  http.post<{ id: string }, { accept: boolean }>(`${BASE}/notifications/:id/answer`, async ({ request }) => {
    const { accept } = await request.json()
    await delay()
    return HttpResponse.json({ status: accept ? 'accepted' : 'declined' })
  }),
]
