import type { Transaction } from '@/Transactions/domain/Transaction'
import { Badge, Box, HStack, Text } from '@/common/ui'
import { useTheme } from 'next-themes'
import {
  useCategoryColors,
  useTypeColor,
  getCategoryIcon,
  getDescriptionIcon
} from '@/Transactions/common/constants/colors'
import { useMemo } from 'react'
import { menuItems } from './list-item.helpers'
import { useEditFormStore } from '@/Transactions/stores'
import { BubbleMenu } from '@/Transactions/common/ui'

interface TransactionItemProps {
  transaction: Transaction
  onOpenCategoryDrawer?: (transaction: Transaction) => void
}

export const TransactionItem = ({
  transaction,
  onOpenCategoryDrawer
}: TransactionItemProps) => {
  if (!transaction?.type) return null

  const { openDialog } = useEditFormStore()
  const { resolvedTheme } = useTheme()
  const { textColors: categoryTextColors, bgColors: categoryBgColors } =
    useCategoryColors(resolvedTheme)
  const typeColors = useTypeColor(resolvedTheme)

  const { VItems, HItems } = useMemo(
    () => menuItems(resolvedTheme, transaction, openDialog),
    [resolvedTheme, transaction]
  )

  const fontWeight = resolvedTheme === 'light' ? '600' : '500'
  const borderColor = resolvedTheme === 'light' ? 'gray.200' : 'gray.800'

  return (
    <BubbleMenu
      verticalMenuItems={VItems}
      horizontalMenuItems={HItems}
      trigger={
        <HStack
          w="100%"
          px={4}
          py={2}
          gap={3}
          fontSize={14}
          cursor="pointer"
          borderBottom="xs"
          borderColor={borderColor}
        >
          <Text minW={95} maxW={95} flexShrink={0}>
            {transaction.formattedDate}
          </Text>

          <HStack flex={1} minW={0} maxW="100%" gap={2}>
            {(() => {
              const DescIcon = getDescriptionIcon(transaction.description)
              return (
                <Box
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  w={7}
                  h={7}
                  flexShrink={0}
                  borderRadius="full"
                  bg="gray.100"
                  _dark={{ bg: 'gray.700' }}
                >
                  <DescIcon size={14} />
                </Box>
              )
            })()}
            <Text truncate minW={0}>{transaction.description}</Text>
          </HStack>

          <Badge
            as="button"
            type="button"
            pl={2}
            variant="subtle"
            minW={120}
            maxW={120}
            flexShrink={0}
            color={categoryTextColors[transaction.category!.id]}
            bg={categoryBgColors[transaction.category!.id]}
            fontSize={13}
            height={6}
            cursor={onOpenCategoryDrawer ? 'pointer' : 'default'}
            _hover={
              onOpenCategoryDrawer
                ? { opacity: 0.9, ring: '2px', ringColor: 'gray.400' }
                : undefined
            }
            onClick={e => {
              if (onOpenCategoryDrawer) {
                e.stopPropagation()
                onOpenCategoryDrawer(transaction)
              }
            }}
          >
            <HStack gap={1.5} display="inline-flex" alignItems="center">
              {(() => {
                const CatIcon = getCategoryIcon(transaction.category!.id)
                return <CatIcon size={12} />
              })()}
              <span>{transaction.category!.name}</span>
            </HStack>
          </Badge>

          <Text
            minW={120}
            maxW={120}
            flexShrink={0}
            textAlign="right"
            color={typeColors[transaction.type.id]}
            fontWeight={fontWeight}
          >
            {transaction.isExpense ? '- ' : '+ '}
            {transaction.formattedAmount}
          </Text>
        </HStack>
      }
    />
  )
}
