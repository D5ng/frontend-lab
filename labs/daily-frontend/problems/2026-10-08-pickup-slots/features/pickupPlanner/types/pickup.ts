export type Day = 'today' | 'tomorrow'

export type Slot = { id: string; label: string }

export type LoadSlots = (day: Day) => Promise<Slot[]>

export type ReserveSlot = (request: { day: Day; slotId: string }) => Promise<void>
