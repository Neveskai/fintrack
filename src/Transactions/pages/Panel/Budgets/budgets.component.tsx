import { useMemo, useRef } from 'react'
import { Box, Heading, Text, Link as ChakraLink } from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Transaction } from '@/Transactions/domain/Transaction'
import { getCategoryIcon, getCategoryChartColor } from '@/Transactions/common/constants/colors'
import { Category } from '@/Transactions/common/enums'
import type { BudgetDTO } from '@/common/services/UserSettings'
import { TransactionRoutes } from '@/Transactions/transactions.routes'
import { useListFiltersStore } from '@/Transactions/stores'
import { buildListFilterParams } from '@/Transactions/common/hooks'

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })

interface BudgetsProps {
  transactions: Transaction[]
  budgets: BudgetDTO[] | undefined
  bgColor: string
  headingColor: string
  labelColor: string
}

export const Budgets = ({
  transactions,
  budgets,
  bgColor,
  headingColor,
  labelColor
}: BudgetsProps) => {
  const navigate = useNavigate()
  const listFilters = useListFiltersStore()
  const listFiltersRef = useRef(listFilters)
  listFiltersRef.current = listFilters

  const spentByCategory = useMemo(() => {
    const map: Record<number, number> = {}
    for (const t of transactions) {
      if (!t.isExpense || !t.category) continue
      const id = t.category.id
      map[id] = (map[id] ?? 0) + t.amount
    }
    return map
  }, [transactions])

  const budgetCards = useMemo(() => {
    if (!budgets?.length) return []
    return budgets.map(b => {
      const category = Category.fromId(b.categoryId)
      const name = category?.name ?? `Categoria ${b.categoryId}`
      const spent = spentByCategory[b.categoryId] ?? 0
      const limit = b.limitCents / 100
      const exceeded = spent > limit
      const percentExceeded =
        limit > 0 && exceeded ? ((spent - limit) / limit) * 100 : 0
      const percentRemaining =
        limit > 0 && !exceeded ? ((limit - spent) / limit) * 100 : 0
      return {
        categoryId: b.categoryId,
        name,
        spent,
        limit,
        exceeded,
        percentExceeded,
        percentRemaining,
        categoryColor: getCategoryChartColor(b.categoryId)
      }
    })
  }, [budgets, spentByCategory])

  if (budgetCards.length === 0) {
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
            Orçamentos
          </Heading>
          <ChakraLink
            as={RouterLink}
            to={TransactionRoutes.Budget}
            color="blue.500"
            _dark={{ color: 'blue.400' }}
            fontWeight={500}
            fontSize="sm"
          >
            Orçamento →
          </ChakraLink>
        </Box>
        <Text color={labelColor} fontSize="sm">
          Nenhum orçamento definido. Clique em &quot;ORÇAMENTO →&quot; para criar.
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
      overflow="hidden"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Heading size="md" color={headingColor}>
          Orçamentos
        </Heading>
        <ChakraLink
          as={RouterLink}
          to={TransactionRoutes.Budget}
          color="blue.500"
          _dark={{ color: 'blue.400' }}
          fontWeight={500}
          fontSize="sm"
        >
          Orçamento →
        </ChakraLink>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{
          base: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)'
        }}
        gap={3}
      >
        {budgetCards.slice(0, 8).map(card => {
          const Icon = getCategoryIcon(card.categoryId)
          const handleCardClick = () => {
            const params = buildListFilterParams({
              ...listFiltersRef.current,
              category: String(card.categoryId)
            })
            navigate(`${TransactionRoutes.Transactions}?${params.toString()}`)
          }
          return (
            <Box
              key={card.categoryId}
              p={3}
              borderRadius="md"
              borderWidth="1px"
              borderColor="gray.200"
              bg="white"
              _dark={{ borderColor: 'gray.600', bg: 'gray.800' }}
              textAlign="center"
              cursor="pointer"
              onClick={handleCardClick}
              _hover={{ bg: 'gray.50', _dark: { bg: 'gray.700' } }}
              transition="background 0.15s"
            >
              <Box
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                w={10}
                h={10}
                borderRadius="full"
                borderWidth="1px"
                borderColor="white"
                _dark={{ borderColor: 'gray.600' }}
                bg={card.categoryColor}
                color="white"
                mb={2}
              >
                <Icon size={20} />
              </Box>
              <Text fontWeight="bold" color={headingColor} fontSize="md">
                {formatCurrency(card.spent)}
              </Text>
              <Text fontSize="sm" color={labelColor} noOfLines={2} title={card.name}>
                {card.name}
              </Text>
              <Text
                fontSize="xs"
                color={card.exceeded ? 'red.500' : 'green.500'}
                mt={0.5}
              >
                {card.exceeded
                  ? `${card.percentExceeded.toFixed(0)}% excedido`
                  : `${card.percentRemaining.toFixed(0)}% restante`}
              </Text>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
