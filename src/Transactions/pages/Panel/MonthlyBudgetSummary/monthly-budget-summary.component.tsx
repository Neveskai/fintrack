import { Box, Heading, Text, Link as ChakraLink } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import type { BudgetDTO } from '@/common/services/UserSettings'
import { TransactionRoutes } from '@/Transactions/transactions.routes'

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })

interface MonthlyBudgetSummaryProps {
  totalExpense: number
  budgets: BudgetDTO[] | undefined
  bgColor: string
  headingColor: string
  labelColor: string
}

export const MonthlyBudgetSummary = ({
  totalExpense,
  budgets,
  bgColor,
  headingColor,
  labelColor
}: MonthlyBudgetSummaryProps) => {
  const totalBudgeted =
    budgets?.reduce((acc, b) => acc + b.limitCents / 100, 0) ?? 0
  const remaining = totalBudgeted - totalExpense
  const exceeded = remaining < 0
  const percentVsBudget =
    totalBudgeted > 0
      ? (Math.abs(remaining) / totalBudgeted) * 100
      : 0
  const percentColor = exceeded ? 'red.500' : 'green.500'

  return (
    <Box
      bg={bgColor}
      p={{ base: 3, md: 4 }}
      borderRadius="xs"
      shadow="xs"
      w="100%"
      minW={0}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Heading size="sm" color={headingColor} fontWeight={600}>
          Total vs Orçamento
        </Heading>
        <ChakraLink
          as={RouterLink}
          to={TransactionRoutes.Budget}
          fontSize="xs"
          fontWeight={600}
          color="blue.500"
          _dark={{ color: 'blue.400' }}
        >
          Orçamento →
        </ChakraLink>
      </Box>
      <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight={700} color={headingColor}>
        {totalBudgeted > 0
          ? `${exceeded ? '-' : '+'}${formatCurrency(Math.abs(remaining))}`
          : 'Nenhum orçamento definido'}
      </Text>
      <Text fontSize="sm" color={labelColor} mt={1}>
        {totalBudgeted > 0 ? (
          <>
            <Text as="span" color={percentColor} fontWeight={600}>
              {percentVsBudget.toFixed(0)}%
            </Text>
            {exceeded ? ' acima do orçado.' : ' abaixo do orçado.'}
          </>
        ) : (
          'Defina orçamentos para acompanhar.'
        )}
      </Text>
    </Box>
  )
}
