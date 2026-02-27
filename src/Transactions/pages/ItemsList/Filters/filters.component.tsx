import { HStack } from '@chakra-ui/react'
import { Input, Select } from '@/common/ui'
import { useItemListFiltersStore } from '@/Transactions/stores'
import { useSearchParams } from 'react-router-dom'
import { buildItemListFilterParams } from '@/Transactions/common/hooks'
import type { ItemListSortBy } from '@/Transactions/common/services/TransactionItems'

const sortByOptions: { value: ItemListSortBy; label: string }[] = [
  { value: 'description', label: 'Descrição' },
  { value: 'amount', label: 'Valor' },
  { value: 'quantity', label: 'Quantidade' }
]

export const ItemsListFilters = () => {
  const [, setSearchParams] = useSearchParams()
  const { searchText, setSearchText, selectedDate, sortBy, setSortBy, sortDirection } =
    useItemListFiltersStore()

  const syncUrl = (next: Partial<{ searchText: string; sortBy: ItemListSortBy }>) => {
    setSearchParams(
      buildItemListFilterParams({
        searchText: next.searchText ?? searchText,
        selectedDate,
        sortBy: next.sortBy ?? sortBy,
        sortDirection
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
        placeholder="Descrição do item..."
        value={searchText}
        onChange={e => {
          setSearchText(e.target.value)
          syncUrl({ searchText: e.target.value })
        }}
        maxW={{ base: '100%' }}
      />
      <Select
        label="Ordenar por"
        value={sortBy}
        onChange={v => {
          setSortBy(v as ItemListSortBy)
          syncUrl({ sortBy: v as ItemListSortBy })
        }}
        options={sortByOptions}
      />
    </HStack>
  )
}
