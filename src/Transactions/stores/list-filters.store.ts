import { SortDTO } from '@/Transactions/common/services/Transactions'
import { create } from 'zustand'
import { useSharedDateStore } from './shared-date.store'

export type GroupByOption = 'none' | 'category' | 'date' | 'description'

interface ListOnlyState {
  sortBy: SortDTO['sortBy']
  sortDirection: SortDTO['sortDirection']
  category: string
  searchText: string
  groupBy: GroupByOption

  setCategory: (value: string) => void
  setSearchText: (value: string) => void
  setSortBy: (value: SortDTO['sortBy']) => void
  setSortDirection: (value: SortDTO['sortDirection']) => void
  setGroupBy: (value: GroupByOption) => void

  reset: () => void
}

const useListOnlyStore = create<ListOnlyState>(set => ({
  category: '',
  searchText: '',
  sortBy: 'date',
  sortDirection: 'desc',
  groupBy: 'none',

  setCategory: value => set({ category: value }),
  setSearchText: value => set({ searchText: value }),
  setSortBy: value => set({ sortBy: value }),
  setSortDirection: value => set({ sortDirection: value }),
  setGroupBy: value => set({ groupBy: value }),

  reset: () =>
    set({
      category: '',
      searchText: '',
      groupBy: 'none'
    })
}))

export const useListFiltersStore = () => {
  const listOnly = useListOnlyStore()
  const { selectedDate, setSelectedDate } = useSharedDateStore()

  return {
    ...listOnly,
    selectedDate,
    setSelectedDate,
    reset: () => {
      listOnly.reset()
      setSelectedDate(new Date())
    },
    groupBy: listOnly.groupBy,
    setGroupBy: listOnly.setGroupBy
  }
}
