import { HiArrowUp, HiArrowDown } from 'react-icons/hi'
import { Box, Text } from '@/common/ui'
import { useItemListFiltersStore } from '@/Transactions/stores'
import type { ItemListSortBy } from '@/Transactions/common/services/TransactionItems'
import { useTheme } from 'next-themes'
import { useSearchParams } from 'react-router-dom'
import { buildItemListFilterParams } from '@/Transactions/common/hooks'

export const ItemSortableHeader = ({
  label,
  column,
  align = 'left',
  minW,
  maxW,
  w = '100%'
}: {
  label: string
  column: ItemListSortBy
  align?: 'left' | 'right'
  minW?: number
  maxW?: number
  w?: string | number
}) => {
  const [, setSearchParams] = useSearchParams()
  const { sortBy, sortDirection, searchText, setSortBy, setSortDirection } =
    useItemListFiltersStore()

  const onSort = (col: ItemListSortBy) => {
    const nextDir = sortBy === col ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc'
    if (sortBy === col) {
      setSortDirection(nextDir)
    } else {
      setSortBy(col)
      setSortDirection('asc')
    }
    setSearchParams(
      buildItemListFilterParams({
        searchText,
        sortBy: col,
        sortDirection: nextDir
      }),
      { replace: true }
    )
  }

  const isActive = sortBy === column
  const Icon = sortDirection === 'asc' ? HiArrowUp : HiArrowDown
  const alignment = align === 'right' ? 'flex-end' : 'flex-start'
  const { resolvedTheme } = useTheme()
  const activeColor = resolvedTheme === 'light' ? 'blue.600' : 'blue.400'

  return (
    <Box
      w={w}
      minW={minW}
      maxW={maxW}
      color={isActive ? activeColor : undefined}
      fontWeight={isActive ? 500 : undefined}
      onClick={() => onSort(column)}
    >
      <Box
        w="100%"
        display="flex"
        cursor="pointer"
        alignItems="center"
        justifyContent={alignment}
      >
        <Text w="fit-content">{label}</Text>
        {isActive && <Icon size={14} />}
      </Box>
    </Box>
  )
}
