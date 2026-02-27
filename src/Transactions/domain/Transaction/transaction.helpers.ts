import { queryClient } from '@/app'
import type { TransactionDTO } from '@/Transactions/common/services/Transactions'
import { Transaction } from './transaction.entity'

interface TransactionPage {
  items: TransactionDTO[]
  totalCount: number
  totalIncome: number
  totalExpense: number
}

interface InfiniteTransactionsData {
  pages: TransactionPage[]
  pageParams: number[]
}

/** Converte a instância de Transaction para o DTO bruto esperado pelo cache da query. */
function transactionToDto(t: Transaction): TransactionDTO {
  return {
    id: t.id,
    date: t.date,
    description: t.description,
    amount: t.amount,
    type: t.type.id,
    category: t.category!.id
  }
}

export const updatePaginatedQuery = (
  updatedTransaction: Transaction,
  queryKey: unknown[]
) => {
  const dto = transactionToDto(updatedTransaction)

  queryClient.setQueryData<InfiniteTransactionsData>(queryKey, oldData => {
    if (!oldData) return

    const newPages = oldData.pages.map(page => {
      const index = page.items.findIndex(item => item.id === dto.id)

      if (index === -1) return page

      const updatedItems = [...page.items]
      updatedItems[index] = dto

      return { ...page, items: updatedItems }
    })

    return { ...oldData, pages: newPages }
  })
}
