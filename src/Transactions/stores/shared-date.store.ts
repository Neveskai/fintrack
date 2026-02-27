import { create } from 'zustand'

interface SharedDateState {
  selectedDate: Date | null
  setSelectedDate: (value: Date | null) => void
}

export const useSharedDateStore = create<SharedDateState>(set => ({
  selectedDate: new Date(),
  setSelectedDate: value => set({ selectedDate: value })
}))
