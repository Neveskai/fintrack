import { CategoryEnum, TransactionTypeEnum } from '@/Transactions/common/enums'

export type TransactionDTO = {
  id: string
  date: string
  description: string
  amount: number
  type: TransactionTypeEnum
  category: CategoryEnum
}

export type CreateTransactionPayload = {
  date: string
  description: string
  amount: number
  type: TransactionTypeEnum
  category: CategoryEnum
}

export type UpdateTransactionPayload = Partial<{
  description: string
  amount: number
  category: CategoryEnum
}>

export type TransactionPaginatedResponseDTO = {
  items: TransactionDTO[]
  totalCount: number
  totalIncome: number
  totalExpense: number
}

export type PaginateDTO = {
  page?: number
  size?: number
}

type SortColumns =
  | 'id'
  | 'date'
  | 'description'
  | 'amount'
  | 'type'
  | 'category'

type SortDirections = 'asc' | 'desc'

export type SortDTO = {
  sortBy?: SortColumns
  sortDirection?: SortDirections
}

export interface FiltersDTO {
  category?: number
  selectedDate?: string
  /** Dia do vencimento do cartão (1–31). Período por ciclo de fatura. */
  billingDueDay?: number
  /** Busca textual (ex.: descrição). */
  searchText?: string
}
