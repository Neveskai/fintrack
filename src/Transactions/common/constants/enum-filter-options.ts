import type { SelectOption } from '@/common/ui/Select'
import { TransactionType, Category } from '@/Transactions/common/enums'

export const typeOptions: SelectOption[] = TransactionType.VALUES.map(
  ({ id, name }) => ({
    label: name,
    value: id.toString()
  })
)

export const categoryOptions: SelectOption[] = Category.VALUES.map(
  ({ id, name }) => ({
    label: name,
    value: id.toString()
  })
)
