import { Box, Heading, Text } from '@chakra-ui/react'

const formatCurrency = (value: number, maxFractionDigits = 2) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits
  })

interface SummaryCardProps {
  totalExpense: number
  previousTotal?: number
  bgColor: string
  headingColor: string
  labelColor: string
}

export const SummaryCard = ({
  totalExpense,
  previousTotal = 0,
  bgColor,
  headingColor,
  labelColor
}: SummaryCardProps) => {
  const variation =
    previousTotal > 0 ? ((totalExpense - previousTotal) / previousTotal) * 100 : 0
  const isIncrease = totalExpense > previousTotal

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
        Total Gasto
      </Heading>
      <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight={700} color={headingColor}>
        {formatCurrency(totalExpense)}
      </Text>
      {previousTotal > 0 ? (
        <Text fontSize="sm" color={labelColor} mt={0.5}>
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
        </Text>
      ) : (
        <Text fontSize="sm" color={labelColor} mt={0.5}>
          Sem dados do mês anterior
        </Text>
      )}
    </Box>
  )
}
