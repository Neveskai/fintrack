import { useMemo } from 'react'
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Link as ChakraLink
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { Transaction } from '@/Transactions/domain/Transaction'
import { getCategoryIcon } from '@/Transactions/common/constants/colors'
import { TransactionRoutes } from '@/Transactions/transactions.routes'

const formatShortDate = (dateStr: string) => {
  const [, month, day] = dateStr.split('-')
  return `${day}/${month}`
}

interface RecentTransactionsProps {
  transactions: Transaction[]
  bgColor: string
  headingColor: string
  labelColor: string
  maxItems?: number
}

export const RecentTransactions = ({
  transactions,
  bgColor,
  headingColor,
  labelColor,
  maxItems = 8
}: RecentTransactionsProps) => {
  const recent = useMemo(() => {
    const sorted = [...transactions].sort((a, b) =>
      b.date.localeCompare(a.date, undefined, { numeric: true })
    )
    return sorted.slice(0, maxItems)
  }, [transactions, maxItems])

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
        <Heading size="sm" color={headingColor} fontWeight={600}>
          Transações
        </Heading>
        <ChakraLink
          as={RouterLink}
          to={TransactionRoutes.Transactions}
          fontSize="sm"
          fontWeight={500}
          color="blue.500"
          _dark={{ color: 'blue.400' }}
        >
          Todas transações →
        </ChakraLink>
      </Box>
      <Text fontSize="xs" color={labelColor} mb={2}>
        Mais recentes
      </Text>
      <Box
        maxH="280px"
        overflowY="auto"
        mr={-3}
        pr={3}
        sx={{ '&::-webkit-scrollbar': { width: '8px' } }}
      >
        <VStack align="stretch" gap={0}>
        {recent.length === 0 ? (
          <Text fontSize="sm" color={labelColor} py={2}>
            Nenhuma transação no período
          </Text>
        ) : (
          recent.map(t => {
            const Icon = t.category ? getCategoryIcon(t.category.id) : null
            return (
              <HStack
                key={t.id}
                py={2}
                gap={3}
                borderBottomWidth="1px"
                borderColor="gray.100"
                _dark={{ borderColor: 'gray.700' }}
                _last={{ borderBottomWidth: 0 }}
              >
                <Box
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  w={8}
                  h={8}
                  borderRadius="full"
                  bg="gray.100"
                  _dark={{ bg: 'gray.700' }}
                  flexShrink={0}
                >
                  {Icon ? <Icon size={16} /> : null}
                </Box>
                <Box flex={1} minW={0}>
                  <Text
                    fontSize="sm"
                    color={headingColor}
                    noOfLines={1}
                    title={t.description ?? ''}
                  >
                    {t.description ?? '(sem descrição)'}
                  </Text>
                  <Text fontSize="xs" color={labelColor}>
                    {formatShortDate(t.date)}
                  </Text>
                </Box>
                <Text
                  fontSize="sm"
                  fontWeight={600}
                  color={t.isExpense ? 'red.500' : 'green.500'}
                  _dark={{ color: t.isExpense ? 'red.400' : 'green.400' }}
                  whiteSpace="nowrap"
                >
                  {t.isExpense ? '-' : ''}
                  {t.formattedAmount}
                </Text>
              </HStack>
            )
          })
        )}
        </VStack>
      </Box>
    </Box>
  )
}
