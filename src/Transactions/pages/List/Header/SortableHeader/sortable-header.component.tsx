import { HiArrowUp, HiArrowDown } from 'react-icons/hi'
import { Box, Text } from '@/common/ui'
import { useListFiltersStore } from '@/Transactions/stores'
import { SortDTO } from '@/Transactions/common/services/Transactions'
import { useTheme } from 'next-themes'
import { useSearchParams } from 'react-router-dom'
import { buildListFilterParams } from '@/Transactions/common/hooks'

export const SortableHeader = ({
  label,
  column,
  align = 'left',
  minW,
  maxW,
  w = '100%',
  flex,
  flexShrink
}: {
  label: string
  column: SortDTO['sortBy']
  align?: 'left' | 'right'
  minW?: number
  maxW?: number
  w?: string | number
  flex?: number
  flexShrink?: number
}) => {
  const [, setSearchParams] = useSearchParams()
  const { category, selectedDate, sortBy, sortDirection, searchText, setSortBy, setSortDirection } =
    useListFiltersStore()

  const onSort = (col: typeof sortBy) => {
    const nextDir = sortBy === col ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc'
    
    if (sortBy === col) {
      setSortDirection(nextDir)
    } else {
      setSortBy(col)
      setSortDirection('asc')
    }

    setSearchParams(
      buildListFilterParams({
        selectedDate,
        category,
        searchText,
        sortBy: col,
        sortDirection: nextDir,
        groupBy: 'none'
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
      flex={flex}
      flexShrink={flexShrink}
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
