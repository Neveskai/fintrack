import { Box, Heading, Text } from '@chakra-ui/react'

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

interface ExpenseComparisonProps {
  currentTotal: number
  previousTotal: number
  bgColor: string
  headingColor: string
  labelColor: string
}

export const ExpenseComparison = ({
  currentTotal,
  previousTotal,
  bgColor,
  headingColor,
  labelColor
}: ExpenseComparisonProps) => {
  const variation =
    previousTotal > 0
      ? ((currentTotal - previousTotal) / previousTotal) * 100
      : 0
  const isIncrease = currentTotal > previousTotal

  return (
    <Box
      bg={bgColor}
      p={{ base: 3, md: 4 }}
      borderRadius="xs"
      shadow="xs"
      w="100%"
      minW={0}
    >
      <Heading size="sm" mb={1} color={headingColor} fontWeight={600}>
        Mês Atual vs Anterior
      </Heading>
      <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight={700} color={headingColor}>
        {formatCurrency(currentTotal)}
      </Text>
      <Text fontSize="sm" color={labelColor} mt={1}>
        {previousTotal > 0 ? (
          <>
            <Text
              as="span"
              color={isIncrease ? 'red.500' : 'green.500'}
              fontWeight={600}
            >
              {isIncrease ? '+' : ''}
              {variation.toFixed(1)}%
            </Text>
            {' vs '}
            {formatCurrency(previousTotal)} mês anterior
          </>
        ) : (
          'Sem dados do mês anterior'
        )}
      </Text>
    </Box>
  )
}
