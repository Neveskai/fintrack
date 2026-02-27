import { Box, HStack, Text } from '@/common/ui'
import { useTheme } from 'next-themes'
import { ItemSortableHeader } from './SortableHeader'

export const ItemsListHeader = ({
  count,
  totalAmount
}: {
  count: number
  totalAmount: number
}) => {
  const { resolvedTheme } = useTheme()
  const borderColor = resolvedTheme === 'light' ? 'gray.200' : 'gray.800'
  const textColor = resolvedTheme === 'light' ? 'gray.600' : 'gray.400'
  const bgColor = resolvedTheme === 'light' ? '#fbfcfd' : '#151519'
  const formattedTotal = totalAmount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })

  return (
    <Box
      position="sticky"
      top="55px"
      zIndex={100}
      bg={bgColor}
      borderTopLeftRadius="sm"
      borderTopRightRadius="sm"
    >
      <HStack px={4} pt={2} gap={3} bg={bgColor} justifyContent="space-between">
        <Text fontWeight="bold" fontSize="14.5px">
          {count} itens
        </Text>
        <Text fontWeight="bold" fontSize="14.5px">
          Total: {formattedTotal}
        </Text>
      </HStack>

      <HStack
        gap={3}
        fontSize="14px"
        color={textColor}
        px={4}
        pt={1.5}
        pb={2}
        bg={bgColor}
        borderBottom="xs"
        borderColor={borderColor}
        borderTopLeftRadius="sm"
        borderTopRightRadius="sm"
      >
        <ItemSortableHeader label="Descrição" column="description" minW={250} />
        <ItemSortableHeader label="Quantidade" column="quantity" minW={100} maxW={100} />
        <ItemSortableHeader
          label="Valor (R$)"
          column="amount"
          minW={120}
          maxW={120}
          align="right"
        />
        <Box minW={180} maxW={220}>
          <Text>Transação</Text>
        </Box>
      </HStack>
    </Box>
  )
}
