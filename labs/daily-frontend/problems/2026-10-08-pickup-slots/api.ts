export type Day = 'today' | 'tomorrow'
export type Slot = { id: string; label: string }
export type LoadSlots = (day: Day) => Promise<Slot[]>
export type ReserveSlot = (request: { day: Day; slotId: string }) => Promise<void>
export const slotsByDay: Record<Day, Slot[]> = {
  today: [
    { id: 'today-18', label: '오후 6시' },
    { id: 'today-19', label: '오후 7시' },
  ],
  tomorrow: [
    { id: 'tomorrow-10', label: '오전 10시' },
    { id: 'tomorrow-11', label: '오전 11시' },
  ],
}

export function createPickupMock(): { loadSlots: LoadSlots; reserveSlot: ReserveSlot } {
  let tomorrowAttempts = 0
  let reserveAttempts = 0
  return {
    loadSlots(day) {
      if (day === 'tomorrow') tomorrowAttempts += 1
      const fail = day === 'tomorrow' && tomorrowAttempts === 1
      return new Promise((resolve, reject) => {
        setTimeout(
          () => {
            if (fail) reject(new Error('시간 조회 실패'))
            else resolve(slotsByDay[day].map((slot) => ({ ...slot })))
          },
          day === 'today' ? 1800 : 500,
        )
      })
    },
    reserveSlot({ day, slotId }) {
      reserveAttempts += 1
      const fail = reserveAttempts === 1 || !slotsByDay[day].some((slot) => slot.id === slotId)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (fail) reject(new Error('예약 실패'))
          else resolve()
        }, 1000)
      })
    },
  }
}
