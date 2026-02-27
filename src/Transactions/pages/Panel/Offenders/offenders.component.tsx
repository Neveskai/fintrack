import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { Box, Heading, HStack, Text, VStack } from '@/common/ui'
import { AnimatedList, AnimatedListItem } from '@/common/ui/Animations'
import { Transaction } from '@/Transactions/domain/Transaction'
import { TransactionRoutes } from '@/Transactions/transactions.routes'
import { useListFiltersStore } from '@/Transactions/stores'
import { buildListFilterParams } from '@/Transactions/common/hooks'

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })

export const Offenders = ({
  transactions,
  bgColor,
  headingColor,
  labelColor
}: {
  transactions: Transaction[]
  bgColor: string
  headingColor: string
  labelColor: string
}) => {
  const navigate = useNavigate()
  const { resolvedTheme } = useTheme()
  const {
    selectedDate,
    category,
    sortBy,
    sortDirection,
    groupBy
  } = useListFiltersStore()
  const borderColor = resolvedTheme === 'light' ? 'gray.200' : 'gray.800'
  const headerBgColor = resolvedTheme === 'light' ? '#fbfcfd' : '#151519'

  const handleRowClick = (description: string) => {
    const params = buildListFilterParams({
      selectedDate,
      category,
      searchText: description,
      sortBy,
      sortDirection,
      groupBy
    })
    
    navigate(`${TransactionRoutes.Transactions}?${params.toString()}`)
  }

  const top5 = useMemo(() => {
    const byDescription = new Map<string, number>()

    for (const t of transactions) {
      if (!t.isExpense) continue

      const desc = t.description?.trim() || '(sem descrição)'

      byDescription.set(desc, (byDescription.get(desc) ?? 0) + t.amount)
    }

    return Array.from(byDescription.entries())
      .map(([description, total]) => ({ description, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  }, [transactions])

  return (
    <Box w="100%" minW={0}>
      <Box
        bg={bgColor}
        p={{ base: 3, md: 4 }}
        borderRadius="xs"
        shadow="xs"
        position="relative"
        w="100%"
        minW={0}
        overflow="hidden"
      >
        <Heading size="md" mb={3} color={headingColor}>
          Principais ofensores
        </Heading>

        {top5.length > 0 ? (
          <VStack
            gap={0}
            align="stretch"
            border="xs"
            borderColor={borderColor}
            bg="Background"
            borderRadius="xs"
            minW={0}
          >
            <HStack
              gap={3}
              fontSize="14px"
              color={labelColor}
              px={4}
              pt={1.5}
              pb={2}
              bg={headerBgColor}
              borderBottom="xs"
              borderColor={borderColor}
            >
              <Text fontWeight="bold" minW={250}>
                Descrição
              </Text>

              <Text fontWeight="bold" minW={120} maxW={120} textAlign="right">
                Valor (R$)
              </Text>
            </HStack>

            <AnimatedList>
              {top5.map(({ description, total }, i) => (
                <AnimatedListItem key={`${description}-${i}`}>
                  <HStack
                    px={4}
                    py={2}
                    gap={3}
                    fontSize={14}
                    borderBottom="xs"
                    borderColor={borderColor}
                    cursor="pointer"
                    onClick={() => handleRowClick(description)}
                    _hover={{ bg: resolvedTheme === 'light' ? 'gray.50' : 'whiteAlpha.100' }}
                  >
                    <Text minW={250} truncate title={description} color={labelColor}>
                      {description}
                    </Text>

                    <Text
                      minW={120}
                      maxW={120}
                      textAlign="right"
                      fontWeight="600"
                      color={labelColor}
                    >
                      {formatCurrency(total)}
                    </Text>
                  </HStack>
                </AnimatedListItem>
              ))}
            </AnimatedList>
          </VStack>
        ) : (
          <Text fontSize="md" color={labelColor} opacity={0.8}>
            Nenhum gasto no período
          </Text>
        )}
      </Box>
    </Box>
  )
}
