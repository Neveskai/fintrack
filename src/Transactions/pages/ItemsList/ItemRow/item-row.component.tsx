import type { TransactionItemDTO } from '@/Transactions/common/services/TransactionItems'
import { Box, HStack, Text } from '@/common/ui'
import { useTheme } from 'next-themes'
import { Link, useNavigate } from 'react-router-dom'
import { TransactionRoutes } from '@/Transactions/transactions.routes'

type TransactionInfo = { date: string; description: string } | undefined

const formatDate = (dateStr: string) => {
  const parts = dateStr.split('-')
  if (parts.length >= 2) {
    const [y, m, d] = parts
    if (d) return `${d}/${m}/${y ?? ''}`
    return `${m}/${y}`
  }
  return dateStr
}

export const ItemRow = ({
  item,
  transactionInfo
}: {
  item: TransactionItemDTO
  transactionInfo: TransactionInfo
}) => {
  const { resolvedTheme } = useTheme()
  const borderColor = resolvedTheme === 'light' ? 'gray.200' : 'gray.800'
  const amountFormatted = item.amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })
  const transactionLabel = transactionInfo
    ? `${formatDate(transactionInfo.date)} - ${transactionInfo.description}`
    : '—'

  return (
    <HStack
      px={4}
      py={2}
      gap={3}
      fontSize={14}
      borderBottom="xs"
      borderColor={borderColor}
    >
      <Text minW={250} truncate>
        {item.description}
      </Text>
      <Text minW={100} maxW={100}>
        {item.quantity}
      </Text>
      <Text minW={120} maxW={120} textAlign="right">
        {amountFormatted}
      </Text>
      <Box minW={180} maxW={220}>
        <Link
          to={`${TransactionRoutes.Transactions}?open=${item.transactionId}`}
          style={{ fontSize: 14, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {transactionLabel}
        </Link>
      </Box>
    </HStack>
  )
}
