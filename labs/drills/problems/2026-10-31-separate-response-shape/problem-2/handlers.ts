import { delay, http, HttpResponse } from 'msw'

// 모의 서버다. 풀이 대상이 아니다.
const BASE = '/api/drills/2026-10-31/rooms'

// 최근에 올라온 순서다.
const rooms = [
  {
    room_id: 301,
    title: '역까지 걸어서 5분, 햇빛 잘 드는 원룸',
    deposit: 500,
    monthly_rent: 45,
    maintenance_fee: 7,
    area_m2: 23.1,
    floor: '3/5',
    available_from: null,
    description: '남향이라 낮에는 불을 켜지 않아도 밝아요. 지하철역까지 걸어서 5분이고, 1층에 편의점이 있어요.',
    options: ['AIRCON', 'WASHER', 'FRIDGE', 'BED'],
  },
  {
    room_id: 302,
    title: '큰길 안쪽이라 조용한 분리형 원룸',
    deposit: 1000,
    monthly_rent: 50,
    maintenance_fee: 5,
    area_m2: 29.7,
    floor: '2/4',
    available_from: '2026-11-15',
    description: '주방과 방이 문으로 나뉘어 있어요. 지금 사는 분이 11월 14일에 나가요.',
    options: ['AIRCON', 'WASHER', 'FRIDGE', 'INDUCTION'],
  },
  {
    room_id: 303,
    title: '새로 지은 건물, 엘리베이터 있어요',
    deposit: 300,
    monthly_rent: 55,
    maintenance_fee: 10,
    area_m2: 19.8,
    floor: '7/10',
    available_from: null,
    description: '올해 지은 건물이에요. 관리비에 인터넷과 수도 요금이 들어 있어요.',
    options: ['AIRCON', 'WASHER', 'FRIDGE', 'INDUCTION', 'DESK'],
  },
  {
    room_id: 304,
    title: '버스 정류장 바로 앞 복층 원룸',
    deposit: 500,
    monthly_rent: 38,
    maintenance_fee: 8,
    area_m2: 26.4,
    floor: '4/4',
    available_from: '2026-12-01',
    description: '꼭대기 층 복층이라 위층 소음이 없어요. 정류장이 건물 바로 앞이에요.',
    options: ['AIRCON', 'FRIDGE'],
  },
  {
    room_id: 305,
    title: '주인 세대가 같이 사는 깔끔한 원룸',
    deposit: 200,
    monthly_rent: 40,
    maintenance_fee: 3,
    area_m2: 16.5,
    floor: '1/3',
    available_from: null,
    description: '집주인이 2층에 살아서 고장 나면 바로 고쳐 줘요. 작은 마당이 있어요.',
    options: ['WASHER', 'FRIDGE', 'BED', 'DESK'],
  },
]

export const handlers = [
  http.get(BASE, async () => {
    await delay()
    return HttpResponse.json({
      rooms: rooms.map((room) => ({
        room_id: room.room_id,
        title: room.title,
        deposit: room.deposit,
        monthly_rent: room.monthly_rent,
        maintenance_fee: room.maintenance_fee,
        area_m2: room.area_m2,
        floor: room.floor,
        available_from: room.available_from,
      })),
      total_count: rooms.length,
    })
  }),

  http.get(`${BASE}/:roomId`, async ({ params }) => {
    await delay()
    const room = rooms.find((item) => String(item.room_id) === params.roomId)
    if (!room) return HttpResponse.json({ message: 'NOT_FOUND' }, { status: 404 })
    return HttpResponse.json(room)
  }),

  http.post(`${BASE}/:roomId/visit-requests`, async () => {
    await delay()
    return HttpResponse.json({ request_id: 'vr-1' }, { status: 201 })
  }),
]
