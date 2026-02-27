import { Box, HStack, Text } from '@/common/ui'
import { useTheme } from 'next-themes'
import { SortableHeader } from './SortableHeader'
import { GroupSortableHeader, type GroupSortColumn } from './GroupSortableHeader'
import type { GroupByOption } from '@/Transactions/stores'

const groupByColumnLabel: Record<Exclude<GroupByOption, 'none'>, string> = {
  date: 'Data',
  category: 'Categoria',
  description: 'Descrição'
}

export const Header = ({
  totalIncome,
  totalExpense,
  count,
  groupBy = 'none',
  groupCount,
  groupSortBy = 'amount',
  groupSortDirection = 'desc',
  onGroupSort
}: {
  totalIncome: number
  totalExpense: number
  count: number
  groupBy?: GroupByOption
  /** Quando groupBy !== 'none', número de linhas (grupos) exibidas */
  groupCount?: number
  groupSortBy?: GroupSortColumn
  groupSortDirection?: 'asc' | 'desc'
  onGroupSort?: (column: GroupSortColumn) => void
}) => {
  const { resolvedTheme } = useTheme()

  const borderColor = resolvedTheme === 'light' ? 'gray.200' : 'gray.800'
  const textColor = resolvedTheme === 'light' ? 'gray.600' : 'gray.400'
  const bgColor = resolvedTheme === 'light' ? '#fbfcfd' : '#151519'
  const isGrouped = groupBy !== 'none'

  return (
    <Box
      position="sticky"
      top="55px"
      zIndex={100}
      bg={bgColor}
      borderTopLeftRadius="sm"
      borderTopRightRadius="sm"
    >
      <HStack px={4} pt={2} gap={3} bg={bgColor} justifyContent="space-between">
        <Text fontWeight="bold" fontSize="14.5px">
          {isGrouped
            ? `${groupCount ?? 0} grupos`
            : `${count} transações`}
        </Text>

        <HStack gap={4} />
      </HStack>

      <HStack
        w="100%"
        gap={3}
        fontSize="14px"
        color={textColor}
        px={4}
        pt={1.5}
        pb={2}
        bg={bgColor}
        borderBottom="xs"
        borderColor={borderColor}
        borderTopLeftRadius="sm"
        borderTopRightRadius="sm"
      >
        {isGrouped ? (
          <>
            <GroupSortableHeader
              label={groupByColumnLabel[groupBy]}
              column="label"
              sortBy={groupSortBy}
              sortDirection={groupSortDirection}
              onSort={onGroupSort ?? (() => {})}
              flex={1}
              minW={250}
              maxW="100%"
            />
            <GroupSortableHeader
              label="Valor (R$)"
              column="amount"
              sortBy={groupSortBy}
              sortDirection={groupSortDirection}
              onSort={onGroupSort ?? (() => {})}
              align="right"
              minW={120}
              maxW={120}
              flexShrink={0}
            />
          </>
        ) : (
          <>
            <SortableHeader label="Data" column="date" minW={95} maxW={95} flexShrink={0} />

            <SortableHeader
              label="Descrição"
              column="description"
              flex={1}
              minW={250}
              maxW="100%"
            />

            <SortableHeader
              label="Categoria"
              column="category"
              minW={120}
              maxW={120}
              flexShrink={0}
            />

            <SortableHeader
              minW={120}
              maxW={120}
              label="Valor (R$)"
              column="amount"
              align="right"
              flexShrink={0}
            />
          </>
        )}
      </HStack>
    </Box>
  )
}
