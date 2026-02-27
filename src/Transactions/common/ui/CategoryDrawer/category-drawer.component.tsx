import { useCallback, useState } from 'react'
import {
  Box,
  CloseButton,
  Dialog,
  Portal,
  VStack,
  Text,
  Button,
  Input
} from '@/common/ui'
import { Category } from '@/Transactions/common/enums'
import { useUserSettings } from '@/common/hooks'
import { useTheme } from 'next-themes'
import { useCategoryColors } from '@/Transactions/common/constants/colors'
import type { Transaction } from '@/Transactions/domain/Transaction'
import { BsPlus } from 'react-icons/bs'

interface CategoryDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
}

export const CategoryDrawer = ({
  open,
  onOpenChange,
  transaction
}: CategoryDrawerProps) => {
  const { customCategories, setCustomCategories } = useUserSettings()
  const { resolvedTheme } = useTheme()
  const { textColors: categoryTextColors, bgColors: categoryBgColors } =
    useCategoryColors(resolvedTheme)
  const [newCategoryName, setNewCategoryName] = useState('')

  const handleSelectCategory = useCallback(
    async (categoryId: number) => {
      if (!transaction) return
      await transaction.updateFields({ category: categoryId })
      onOpenChange(false)
    },
    [transaction, onOpenChange]
  )

  const handleAddCategory = useCallback(() => {
    const name = newCategoryName.trim()
    if (!name) return
    const existing = customCategories ?? []
    const nextId =
      existing.length === 0 ? 1000 : Math.max(...existing.map(c => c.id)) + 1
    setCustomCategories([...existing, { id: nextId, name }])
    setNewCategoryName('')
  }, [newCategoryName, customCategories, setCustomCategories])

  const categories = [
    ...Category.VALUES,
    ...(customCategories ?? [])
  ]
  const currentCategoryId = transaction?.category?.id

  return (
    <Dialog.Root
      open={open}
      onOpenChange={e => onOpenChange(e.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner
          position="fixed"
          insetY={0}
          right={0}
          left="auto"
          w={{ base: '100%', sm: '320px' }}
          maxW="100vw"
          margin={0}
          borderRadius={0}
        >
          <Dialog.Content
            height="100%"
            borderRadius={0}
            flexDirection="column"
            display="flex"
          >
            <Dialog.Header borderBottomWidth="1px">
              <Dialog.Title>Alterar categoria</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body flex={1} overflowY="auto" py={0}>
              <VStack align="stretch" gap={1} py={3}>
                {transaction && (
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    {transaction.description}
                  </Text>
                )}
                {categories.map(cat => (
                  <Box
                    key={cat.id}
                    as="button"
                    type="button"
                    textAlign="left"
                    px={3}
                    py={2}
                    borderRadius="md"
                    cursor="pointer"
                    bg={
                      currentCategoryId === cat.id
                        ? categoryBgColors[cat.id]
                        : 'transparent'
                    }
                    color={categoryTextColors[cat.id]}
                    _hover={{
                      bg: categoryBgColors[cat.id]
                    }}
                    onClick={() => handleSelectCategory(cat.id)}
                  >
                    {cat.name}
                  </Box>
                ))}
              </VStack>

              <Box
                borderTopWidth="1px"
                pt={3}
                pb={2}
                mt={2}
              >
                <Text fontSize="sm" fontWeight={600} mb={2}>
                  Nova categoria
                </Text>
                <VStack align="stretch" gap={2}>
                  <Input
                    placeholder="Nome da categoria"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    size="sm"
                  />
                  <Button
                    size="sm"
                    colorPalette="blue"
                    leftIcon={<BsPlus />}
                    onClick={handleAddCategory}
                    disabled={!newCategoryName.trim()}
                  >
                    Criar categoria
                  </Button>
                </VStack>
              </Box>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
