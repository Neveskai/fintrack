import { useMemo } from 'react'
import {
  Box,
  Heading,
  Text,
  Link as ChakraLink,
  Table,
  HStack
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Transaction } from '@/Transactions/domain/Transaction'
import { getCategoryIcon, getCategoryChartColor } from '@/Transactions/common/constants/colors'
import { Category } from '@/Transactions/common/enums'
import { TransactionRoutes } from '@/Transactions/transactions.routes'
import { buildListFilterParams } from '@/Transactions/common/hooks'
import { useListFiltersStore } from '@/Transactions/stores'
import { FiArrowUpRight } from 'react-icons/fi'

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })

interface MainCategoriesProps {
  currentTransactions: Transaction[]
  previousTransactions: Transaction[]
  bgColor: string
  headingColor: string
  labelColor: string
  maxCategories?: number
}

export const MainCategories = ({
  currentTransactions,
  previousTransactions,
  bgColor,
  headingColor,
  labelColor,
  maxCategories = 10
}: MainCategoriesProps) => {
  const navigate = useNavigate()
  const listFilters = useListFiltersStore()

  const rows = useMemo(() => {
    const currentByCat: Record<number, number> = {}
    const previousByCat: Record<number, number> = {}

    for (const t of currentTransactions) {
      if (!t.isExpense || !t.category) continue
      const id = t.category.id
      currentByCat[id] = (currentByCat[id] ?? 0) + t.amount
    }
    for (const t of previousTransactions) {
      if (!t.isExpense || !t.category) continue
      const id = t.category.id
      previousByCat[id] = (previousByCat[id] ?? 0) + t.amount
    }

    const allIds = new Set<number>([
      ...Object.keys(currentByCat).map(Number),
      ...Object.keys(previousByCat).map(Number)
    ])

    return Array.from(allIds)
      .map(categoryId => {
        const category = Category.fromId(categoryId)
        const name = category?.name ?? `Categoria ${categoryId}`
        const current = currentByCat[categoryId] ?? 0
        const previous = previousByCat[categoryId] ?? 0
        const variation =
          previous > 0 ? ((current - previous) / previous) * 100 : 0
        const isIncrease = current > previous
        return {
          categoryId,
          name,
          current,
          previous,
          variation,
          isIncrease
        }
      })
      .filter(row => row.current > 0 || row.previous > 0)
      .sort((a, b) => b.current - a.current)
      .slice(0, maxCategories)
  }, [currentTransactions, previousTransactions, maxCategories])

  const handleRowClick = (categoryId: number) => {
    const params = buildListFilterParams({
      ...listFilters,
      category: String(categoryId)
    })
    navigate(`${TransactionRoutes.Transactions}?${params.toString()}`)
  }

  if (rows.length === 0) {
    return (
      <Box
        bg={bgColor}
        p={{ base: 3, md: 4 }}
        borderRadius="xs"
        shadow="xs"
        w="100%"
        minW={0}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Heading size="md" color={headingColor}>
            PRINCIPAIS CATEGORIAS
          </Heading>
          <ChakraLink
            as={RouterLink}
            to={TransactionRoutes.Transactions}
            color="blue.500"
            _dark={{ color: 'blue.400' }}
            fontWeight={500}
            fontSize="sm"
            display="inline-flex"
            alignItems="center"
            gap={1}
          >
            Ver mais <FiArrowUpRight size={14} />
          </ChakraLink>
        </Box>
        <Text color={labelColor} fontSize="sm">
          Não há dados de gastos por categoria no período atual ou anterior.
        </Text>
      </Box>
    )
  }

  return (
    <Box
      bg={bgColor}
      p={{ base: 3, md: 4 }}
      borderRadius="xs"
      shadow="xs"
      w="100%"
      minW={0}
      overflow="auto"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Heading size="md" color={headingColor}>
          PRINCIPAIS CATEGORIAS
        </Heading>
        <ChakraLink
          as={RouterLink}
          to={TransactionRoutes.Transactions}
          color="blue.500"
          _dark={{ color: 'blue.400' }}
          fontWeight={500}
          fontSize="sm"
          display="inline-flex"
          alignItems="center"
          gap={1}
        >
          Ver mais <FiArrowUpRight size={14} />
        </ChakraLink>
      </Box>

      <Table.Root size="sm" variant="plain">
        <Table.Header>
          <Table.Row borderBottomWidth="1px" borderColor="gray.200" _dark={{ borderColor: 'gray.600' }}>
            <Table.ColumnHeader color={labelColor} fontWeight={600} textTransform="uppercase" fontSize="xs">
              Categoria
            </Table.ColumnHeader>
            <Table.ColumnHeader color={labelColor} fontWeight={600} textTransform="uppercase" fontSize="xs" textAlign="end">
              Atual
            </Table.ColumnHeader>
            <Table.ColumnHeader color={labelColor} fontWeight={600} textTransform="uppercase" fontSize="xs" w="120px">
              vs Anterior
            </Table.ColumnHeader>
            <Table.ColumnHeader color={labelColor} fontWeight={600} textTransform="uppercase" fontSize="xs" textAlign="end" w="72px">
              Var.
            </Table.ColumnHeader>
            <Table.ColumnHeader color={labelColor} fontWeight={600} textTransform="uppercase" fontSize="xs" textAlign="end">
              Anterior
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map(row => {
            const Icon = getCategoryIcon(row.categoryId)
            const barColor = row.isIncrease ? 'red.500' : 'green.500'
            const grayBarPercent = 100
            const barPercent =
              row.previous > 0
                ? Math.min(100, (row.current / row.previous) * 100)
                : (row.current > 0 ? 100 : 0)
            const varText =
              row.previous > 0
                ? row.isIncrease
                  ? `+${row.variation.toFixed(0)}%`
                  : `--${Math.abs(row.variation).toFixed(0)}%`
                : '--'

            return (
              <Table.Row
                key={row.categoryId}
                borderBottomWidth="1px"
                borderColor="gray.100"
                _dark={{ borderColor: 'gray.700' }}
                cursor="pointer"
                _hover={{ bg: 'gray.50', _dark: { bg: 'gray.800' } }}
                onClick={() => handleRowClick(row.categoryId)}
              >
                <Table.Cell py={2}>
                  <HStack gap={2} minW={0}>
                    <Box
                      w={2}
                      h={2}
                      borderRadius="full"
                      flexShrink={0}
                      bg={getCategoryChartColor(row.categoryId)}
                    />
                    <Box
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="center"
                      w={7}
                      h={7}
                      borderRadius="full"
                      bg="gray.100"
                      _dark={{ bg: 'gray.700' }}
                      flexShrink={0}
                    >
                      <Icon size={14} />
                    </Box>
                    <Text color={headingColor} noOfLines={1} title={row.name} fontSize="sm">
                      {row.name}
                    </Text>
                  </HStack>
                </Table.Cell>
                <Table.Cell textAlign="end" color={headingColor} fontSize="sm" fontWeight={500}>
                  {formatCurrency(row.current)}
                </Table.Cell>
                <Table.Cell w="120px">
                  <Box
                    h={2}
                    borderRadius="full"
                    bg="gray.200"
                    _dark={{ bg: 'gray.600' }}
                    overflow="hidden"
                    position="relative"
                    minW={0}
                  >
                    <Box
                      position="absolute"
                      left={0}
                      top={0}
                      h="100%"
                      w={`${grayBarPercent}%`}
                      bg="gray.300"
                      _dark={{ bg: 'gray.500' }}
                      borderRadius="full"
                    />
                    <Box
                      position="absolute"
                      left={0}
                      top={0}
                      h="100%"
                      w={`${barPercent}%`}
                      bg={barColor}
                      borderRadius="full"
                    />
                  </Box>
                </Table.Cell>
                <Table.Cell textAlign="end" w="72px">
                  <Text
                    fontSize="sm"
                    fontWeight={500}
                    color={row.isIncrease ? 'red.500' : 'green.500'}
                  >
                    {varText}
                  </Text>
                </Table.Cell>
                <Table.Cell textAlign="end" color={labelColor} fontSize="sm">
                  {formatCurrency(row.previous)}
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}
