import { HStack } from '@chakra-ui/react'
import { Select, Input } from '@/common/ui'
import { useListFiltersStore } from '@/Transactions/stores'
import type { GroupByOption } from '@/Transactions/stores'
import { useSearchParams } from 'react-router-dom'
import { buildListFilterParams, useCategories } from '@/Transactions/common/hooks'

const groupByOptions: { value: GroupByOption; label: string }[] = [
  { value: 'none', label: 'Nenhum' },
  { value: 'date', label: 'Data' },
  { value: 'category', label: 'Categoria' },
  { value: 'description', label: 'Descrição' }
]

export const Filters = () => {
  const [, setSearchParams] = useSearchParams()
  const { categoryOptions } = useCategories()
  const {
    category,
    setCategory,
    searchText,
    setSearchText,
    selectedDate,
    sortBy,
    sortDirection,
    groupBy,
    setGroupBy
  } = useListFiltersStore()

  const syncUrl = (next: Partial<{
    selectedDate: Date | null
    category: string
    searchText: string
    groupBy: GroupByOption
  }>) => {
    setSearchParams(
      buildListFilterParams({
        selectedDate: next.selectedDate ?? selectedDate,
        category: next.category ?? category,
        searchText: next.searchText ?? searchText,
        sortBy,
        sortDirection,
        groupBy: next.groupBy ?? groupBy
      }),
      { replace: true }
    )
  }

  return (
    <HStack
      gap={2}
      py={1.5}
      alignItems={{ base: 'stretch', md: 'flex-end' }}
      flexDirection={{ base: 'column', md: 'row' }}
    >
      <Input
        label="Buscar"
        placeholder="Descrição..."
        value={searchText}
        onChange={e => {
          setSearchText(e.target.value)
          syncUrl({ searchText: e.target.value })
        }}
        maxW={{ base: '100%' }}
      />

      <Select
        label="Categoria"
        placeholder="Selecione a categoria"
        value={category}
        onChange={v => {
          setCategory(v)
          syncUrl({ category: v })
        }}
        options={categoryOptions}
      />

      <Select
        label="Agrupar por"
        value={groupBy}
        onChange={v => {
          const next = (v === 'none' || v === 'date' || v === 'category' || v === 'description'
            ? v
            : 'none') as GroupByOption
          setGroupBy(next)
          syncUrl({ groupBy: next })
        }}
        options={groupByOptions}
      />
    </HStack>
  )
}
