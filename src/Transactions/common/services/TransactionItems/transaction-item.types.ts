/** Item de compra vinculado a uma transação (detalhamento do gasto). */
export type TransactionItemDTO = {
  id: string
  transactionId: string
  description: string
  quantity: number
  amount: number
}

export type CreateTransactionItemPayload = {
  description: string
  quantity: number
  amount: number
}

export type UpdateTransactionItemPayload = Partial<{
  description: string
  quantity: number
  amount: number
}>

export type ItemListSortBy = 'description' | 'amount' | 'quantity'
export type ItemListSortDirection = 'asc' | 'desc'

export type ItemListFiltersDTO = {
  searchText?: string
  sortBy?: ItemListSortBy
  sortDirection?: ItemListSortDirection
}
