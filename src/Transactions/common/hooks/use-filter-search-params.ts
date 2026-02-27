import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSharedDateStore } from '@/Transactions/stores'
import { useListFiltersStore } from '@/Transactions/stores'
import { useItemListFiltersStore } from '@/Transactions/stores'
import { SortDTO } from '@/Transactions/common/services/Transactions'
import type { GroupByOption } from '@/Transactions/stores'
import type { ItemListSortBy, ItemListSortDirection } from '@/Transactions/common/services/TransactionItems'

const parseDateParam = (value: string | null): Date | null => {
  if (!value) return null

  const parsed = new Date(value + 'T00:00:00')

  return isNaN(parsed.getTime()) ? null : parsed
}

const formatDateParam = (date: Date | null): string | null => {
  if (!date) return null

  return date.toISOString().split('T')[0]
}

export const buildPanelFilterParams = (selectedDate: Date | null): URLSearchParams => {
  const params = new URLSearchParams()
  const dateStr = formatDateParam(selectedDate)
  if (dateStr) params.set('date', dateStr)
  return params
}

export const usePanelFilterSearchParams = () => {
  const [searchParams] = useSearchParams()
  const setSelectedDate = useSharedDateStore(s => s.setSelectedDate)

  useEffect(() => {
    const dateParam = searchParams.get('date')

    if (dateParam) {
      const parsed = parseDateParam(dateParam)

      if (parsed) setSelectedDate(parsed)
    }
  }, [searchParams, setSelectedDate])
}

export type ListFilterParams = {
  selectedDate: Date | null
  category: string
  searchText: string
  sortBy: SortDTO['sortBy']
  sortDirection: SortDTO['sortDirection']
  groupBy: GroupByOption
}

export const buildListFilterParams = (state: ListFilterParams): URLSearchParams => {
  const params = new URLSearchParams()
  const dateStr = formatDateParam(state.selectedDate)

  if (dateStr) params.set('date', dateStr)
  if (state.category) params.set('category', state.category)
  if (state.searchText?.trim()) params.set('q', state.searchText.trim())
  if (state.sortBy && state.sortBy !== 'date') params.set('sortBy', state.sortBy)
  if (state.sortDirection && state.sortDirection !== 'desc') params.set('sortDirection', state.sortDirection)
  if (state.groupBy && state.groupBy !== 'none') params.set('groupBy', state.groupBy)

  return params
}

export const useListFilterSearchParams = () => {
  const [searchParams] = useSearchParams()

  const store = useListFiltersStore()
  const storeRef = useRef(store)

  storeRef.current = store

  useEffect(() => {
    const s = storeRef.current
    const dateParam = searchParams.get('date')
    const sortByParam = searchParams.get('sortBy') as SortDTO['sortBy']
    const sortDirParam = searchParams.get('sortDirection') as SortDTO['sortDirection']
    const categoryParam = searchParams.get('category')
    const groupByParam = searchParams.get('groupBy') as GroupByOption | null
    const qParam = searchParams.get('q')

    if (dateParam) {
      const parsed = parseDateParam(dateParam)
      if (parsed) s.setSelectedDate(parsed)
    }

    if (sortByParam) s.setSortBy(sortByParam)
    if (sortDirParam) s.setSortDirection(sortDirParam)
    if (categoryParam) s.setCategory(categoryParam)
    if (qParam != null) s.setSearchText(qParam)
    if (groupByParam === 'category' || groupByParam === 'date' || groupByParam === 'description') s.setGroupBy(groupByParam)
  }, [searchParams])
}

export type ItemListFilterParams = {
  searchText: string
  selectedDate: Date | null
  sortBy: ItemListSortBy
  sortDirection: ItemListSortDirection
}

export const buildItemListFilterParams = (state: ItemListFilterParams): URLSearchParams => {
  const params = new URLSearchParams()
  const dateStr = formatDateParam(state.selectedDate)
  if (dateStr) params.set('date', dateStr)
  if (state.searchText?.trim()) params.set('q', state.searchText.trim())
  if (state.sortBy && state.sortBy !== 'description') params.set('sortBy', state.sortBy)
  if (state.sortDirection && state.sortDirection !== 'asc') params.set('sortDirection', state.sortDirection)
  return params
}

export const useItemListFilterSearchParams = () => {
  const [searchParams] = useSearchParams()
  const store = useItemListFiltersStore()
  const storeRef = useRef(store)
  storeRef.current = store

  useEffect(() => {
    const s = storeRef.current
    const dateParam = searchParams.get('date')
    const qParam = searchParams.get('q')
    const sortByParam = searchParams.get('sortBy') as ItemListSortBy | null
    const sortDirParam = searchParams.get('sortDirection') as ItemListSortDirection | null
    if (dateParam) {
      const parsed = parseDateParam(dateParam)
      if (parsed) s.setSelectedDate(parsed)
    }
    if (qParam != null) s.setSearchText(qParam)
    if (sortByParam === 'description' || sortByParam === 'amount' || sortByParam === 'quantity') s.setSortBy(sortByParam)
    if (sortDirParam === 'asc' || sortDirParam === 'desc') s.setSortDirection(sortDirParam)
  }, [searchParams])
}
