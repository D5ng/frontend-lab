import { describe, expect, it } from 'vitest'
import type { RoomSummaryResponse } from './api'
import { toRoom } from './toRoom'

describe('toRoom', () => {
  it('301호 응답을 층은 나누고, 평수와 매달 드는 돈은 계산해서 화면이 쓰는 방으로 바꾼다', () => {
    const response: RoomSummaryResponse = {
      room_id: 301,
      title: '역까지 걸어서 5분, 햇빛 잘 드는 원룸',
      deposit: 500,
      monthly_rent: 45,
      maintenance_fee: 7,
      area_m2: 23.1,
      floor: '3/5',
      available_from: null,
    }

    expect(toRoom(response)).toEqual({
      id: 301,
      title: '역까지 걸어서 5분, 햇빛 잘 드는 원룸',
      deposit: 500,
      monthlyRent: 45,
      maintenanceFee: 7,
      areaM2: 23.1,
      floor: '3',
      totalFloor: '5',
      availableFrom: null,
      monthlyCost: 52,
      pyeong: 7,
    })
  })
})
