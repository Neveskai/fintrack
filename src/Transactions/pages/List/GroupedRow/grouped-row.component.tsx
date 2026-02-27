import { Badge, Box, HStack, Text } from '@/common/ui'
import { useTheme } from 'next-themes'
import {
  useCategoryColors,
  useTypeColor,
  getCategoryIcon,
  getDescriptionIcon
} from '@/Transactions/common/constants/colors'
import type { GroupByOption } from '@/Transactions/stores'

export type GroupedRowData = {
  groupBy: GroupByOption
  /** Chave do grupo: date (YYYY-MM-DD), category id (number as string), ou description */
  key: string
  /** Soma com sinal: positivo = receita, negativo = despesa */
  sum: number
  /** Nome da categoria (quando groupBy === 'category') */
  categoryName?: string
  /** Id da categoria para cor (quando groupBy === 'category') */
  categoryId?: number
}

const formatDateLabel = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

const formatAmount = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    signDisplay: 'always'
  })

export const GroupedRow = ({ data }: { data: GroupedRowData }) => {
  const { resolvedTheme } = useTheme()
  const { textColors: categoryTextColors, bgColors: categoryBgColors } =
    useCategoryColors(resolvedTheme)
  const typeColors = useTypeColor(resolvedTheme)
  const borderColor = resolvedTheme === 'light' ? 'gray.200' : 'gray.800'
  const isExpense = data.sum < 0
  const colorKey = isExpense ? 2 : 1 // TransactionType.EXPENSE : INCOME
  const amountColor = typeColors[colorKey as 1 | 2]

  const label =
    data.groupBy === 'date'
      ? formatDateLabel(data.key)
      : data.groupBy === 'category'
        ? data.categoryName ?? `Categoria ${data.key}`
        : data.key

  return (
    <HStack
      w="100%"
      px={4}
      py={2}
      gap={3}
      fontSize={14}
      borderBottom="xs"
      borderColor={borderColor}
    >
      <HStack flex={1} minW={0} maxW="100%" gap={2}>
        {data.groupBy === 'category' && data.categoryId != null && (
          <Box
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w={7}
            h={7}
            flexShrink={0}
            borderRadius="full"
            bg="gray.100"
            _dark={{ bg: 'gray.700' }}
          >
            {(() => {
              const CatIcon = getCategoryIcon(data.categoryId)
              return <CatIcon size={14} />
            })()}
          </Box>
        )}
        {data.groupBy === 'description' && (
          <Box
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w={7}
            h={7}
            flexShrink={0}
            borderRadius="full"
            bg="gray.100"
            _dark={{ bg: 'gray.700' }}
          >
            {(() => {
              const DescIcon = getDescriptionIcon(data.key)
              return <DescIcon size={14} />
            })()}
          </Box>
        )}
        {data.groupBy === 'category' && data.categoryId != null ? (
          <Badge
            variant="subtle"
            minW={120}
            maxW={120}
            flexShrink={0}
            color={categoryTextColors[data.categoryId]}
            bg={categoryBgColors[data.categoryId]}
            fontSize={13}
            height={6}
          >
            <HStack gap={1.5} display="inline-flex" alignItems="center">
              {(() => {
                const CatIcon = getCategoryIcon(data.categoryId)
                return <CatIcon size={12} />
              })()}
              <span>{label}</span>
            </HStack>
          </Badge>
        ) : (
          <Text truncate minW={0}>
            {label}
          </Text>
        )}
      </HStack>

      <Text
        minW={120}
        maxW={120}
        flexShrink={0}
        textAlign="right"
        color={amountColor}
        fontWeight={resolvedTheme === 'light' ? '600' : '500'}
      >
        {formatAmount(data.sum)}
      </Text>
    </HStack>
  )
}
