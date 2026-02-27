import { HiArrowUp, HiArrowDown } from 'react-icons/hi'
import { Box, Text } from '@/common/ui'
import { useTheme } from 'next-themes'

export type GroupSortColumn = 'label' | 'amount'

export const GroupSortableHeader = ({
  label,
  column,
  sortBy,
  sortDirection,
  onSort,
  align = 'left',
  minW,
  maxW,
  flex,
  flexShrink
}: {
  label: string
  column: GroupSortColumn
  sortBy: GroupSortColumn
  sortDirection: 'asc' | 'desc'
  onSort: (column: GroupSortColumn) => void
  align?: 'left' | 'right'
  minW?: number
  maxW?: number
  flex?: number
  flexShrink?: number
}) => {
  const { resolvedTheme } = useTheme()
  const activeColor = resolvedTheme === 'light' ? 'blue.600' : 'blue.400'
  const isActive = sortBy === column
  const Icon = sortDirection === 'asc' ? HiArrowUp : HiArrowDown
  const alignment = align === 'right' ? 'flex-end' : 'flex-start'

  return (
    <Box
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
