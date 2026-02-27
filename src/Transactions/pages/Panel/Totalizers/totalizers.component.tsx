import { useMemo } from 'react'
import { Box, Heading, Text } from '@/common/ui'
import { motion } from 'framer-motion'
import { staggerItem, easeTransition } from '@/common/ui/Animations'
import { Transaction } from '@/Transactions/domain/Transaction'

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })

const MotionBox = motion.create(Box)

export const Totalizers = ({
  bgColor,
  headingColor,
  totalCount,
  totalExpense,
  transactions
}: {
  bgColor: string
  headingColor: string
  totalCount: number
  totalExpense: number
  transactions: Transaction[]
}) => {
  const averageExpensePerDay = useMemo(() => {
    const map = new Map<string, number>()

    for (const t of transactions) {
      if (!t.isExpense) continue
      const key = t.date
      map.set(key, (map.get(key) ?? 0) + t.amount)
    }

    const entries = Array.from(map.entries())

    if (entries.length === 0) return null

    const total = entries.reduce((acc, [, value]) => acc + value, 0)
    
    return total / entries.length
  }, [transactions])

  return (
    <Box
      display="flex"
      flexDirection={{ base: 'column', md: 'row' }}
      width="100%"
      gap={2}
    >
      <motion.div
        style={{ display: 'contents' }}
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.08 }}
      >
        <MotionBox variants={staggerItem} transition={easeTransition} bg={bgColor} p={{ base: 3, md: 4 }} borderRadius="xs" shadow="xs" w="100%">
          <Heading size="md" mb={1} color={headingColor}>
            Total Gasto
          </Heading>

          <Text fontSize={{ base: 20, md: 26 }} fontWeight={600} height={8}>
            {formatCurrency(totalExpense)}
          </Text>
        </MotionBox>

        <MotionBox variants={staggerItem} transition={easeTransition} bg={bgColor} p={{ base: 3, md: 4 }} borderRadius="xs" shadow="xs" w="100%">
          <Heading size="md" mb={1} color={headingColor}>
            Qtd. de Transações
          </Heading>

          <Text fontSize={{ base: 20, md: 26 }} fontWeight={600} height={8}>
            {totalCount}
          </Text>
        </MotionBox>

        <MotionBox variants={staggerItem} transition={easeTransition} bg={bgColor} p={{ base: 3, md: 4 }} borderRadius="xs" shadow="xs" w="100%">
          <Heading size="md" mb={1} color={headingColor}>
            Gasto médio por dia
          </Heading>

          <Text fontSize={{ base: 20, md: 26 }} fontWeight={600} height={8}>
            {averageExpensePerDay !== null ? formatCurrency(averageExpensePerDay) : '—'}
          </Text>
        </MotionBox>
      </motion.div>
    </Box>
  )
}
