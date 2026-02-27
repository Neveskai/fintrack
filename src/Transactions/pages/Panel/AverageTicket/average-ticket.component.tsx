import { Box, Heading, Text } from '@chakra-ui/react'

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

function getDaysInPeriod(selectedDate: Date | null): number {
  if (!selectedDate) return 0
  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth()
  const lastDay = new Date(year, month + 1, 0)
  return lastDay.getDate()
}

interface DailyExpenseProps {
  totalExpense: number
  selectedDate: Date | null
  bgColor: string
  headingColor: string
  labelColor: string
}

export const DailyExpense = ({
  totalExpense,
  selectedDate,
  bgColor,
  headingColor,
  labelColor
}: DailyExpenseProps) => {
  const daysInPeriod = getDaysInPeriod(selectedDate)
  const averagePerDay = daysInPeriod > 0 ? totalExpense / daysInPeriod : 0

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
        Gasto Diário
      </Heading>
      <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight={700} color={headingColor}>
        {formatCurrency(averagePerDay)}
      </Text>
      <Text fontSize="sm" color={labelColor} mt={2}>
        Média de gastos por dia no período
      </Text>
    </Box>
  )
}
