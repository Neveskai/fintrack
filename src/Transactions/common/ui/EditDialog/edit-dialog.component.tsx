import { useRef, useCallback, useEffect } from 'react'
import { Box, CloseButton, Dialog, Portal, VStack } from '@chakra-ui/react'
import { CategoryEnum } from '@/Transactions/common/enums'
import { Select, Input } from '@/common/ui'
import { useCategories } from '@/Transactions/common/hooks'
import { useEditFormStore } from '@/Transactions/stores'
import { TransactionItemsSection } from './TransactionItemsSection'

const DEBOUNCE_MS = 600

export const EditTransactionDialog = () => {
  const {
    editForm: form,
    transaction,
    open,
    onChange,
    persistChanges,
    toggleDialog
  } = useEditFormStore()
  const { categoryOptions } = useCategories()

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCategoryChange = useCallback(
    (value: string) => {
      const category = Number(value) as CategoryEnum
      onChange('category', category)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null
        persistChanges()
      }, DEBOUNCE_MS)
    },
    [onChange, persistChanges]
  )

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  if (!transaction || !form) return null

  return (
    <Dialog.Root open={open} onOpenChange={toggleDialog}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW={transaction.isExpense ? '560px' : undefined}>
            <Dialog.Header>
              <Dialog.Title>Editar Transação</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <VStack gap={3} align="stretch">
                <Input
                  label="Descrição"
                  value={transaction.description}
                  readOnly
                  disabled
                  opacity={1}
                />
                <Box display="flex" gap={3}>
                  <Input
                    label="Valor"
                    value={transaction.formattedAmount}
                    readOnly
                    disabled
                    opacity={1}
                  />
                  <Select
                    clearable={false}
                    label="Categoria"
                    placeholder="Categoria"
                    value={form.category.toString()}
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                  />
                </Box>

                {transaction.isExpense && (
                  <TransactionItemsSection transaction={transaction} />
                )}
              </VStack>
            </Dialog.Body>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
