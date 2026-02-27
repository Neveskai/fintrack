import type { ItemListSortBy, ItemListSortDirection } from '@/Transactions/common/services/TransactionItems'
import { create } from 'zustand'

interface ItemListFiltersState {
  searchText: string
  selectedDate: Date | null
  sortBy: ItemListSortBy
  sortDirection: ItemListSortDirection

  setSearchText: (value: string) => void
  setSelectedDate: (value: Date | null) => void
  setSortBy: (value: ItemListSortBy) => void
  setSortDirection: (value: ItemListSortDirection) => void
  reset: () => void
}

const defaultSortBy: ItemListSortBy = 'description'
const defaultSortDirection: ItemListSortDirection = 'asc'

export const useItemListFiltersStore = create<ItemListFiltersState>(set => ({
  searchText: '',
  selectedDate: new Date(),
  sortBy: defaultSortBy,
  sortDirection: defaultSortDirection,

  setSearchText: value => set({ searchText: value }),
  setSelectedDate: value => set({ selectedDate: value }),
  setSortBy: value => set({ sortBy: value }),
  setSortDirection: value => set({ sortDirection: value }),
  reset: () =>
    set({
      searchText: '',
      selectedDate: new Date(),
      sortBy: defaultSortBy,
      sortDirection: defaultSortDirection
    })
}))
