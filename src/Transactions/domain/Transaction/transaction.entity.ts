import { TransactionDTO, TransactionService } from '@/Transactions/common/services/Transactions'
import { CounterpartyService } from '@/Transactions/common/services/Counterparty'
import { Category, TransactionType } from '@/Transactions/common/enums'
import { updatePaginatedQuery } from './transaction.helpers'
import { EditFormType } from '@/Transactions/stores'

export class Transaction {
  public id: TransactionDTO['id']
  public date: TransactionDTO['date']
  public description: TransactionDTO['description']
  public amount: TransactionDTO['amount']
  public type: ReturnType<typeof TransactionType.fromId>
  public category: ReturnType<typeof Category.fromId>

  constructor(dto: TransactionDTO, private queryKey: unknown[]) {
    this.id = dto.id
    this.date = dto.date
    this.description = dto.description
    this.amount = dto.amount
    this.type = TransactionType.fromId(dto.type)
    this.category = Category.fromId(dto.category)
  }

  get formattedDate(): string {
    const [year, month, day] = this.date.split('-')
    return `${day}/${month}/${year}`
  }

  get formattedAmount(): string {
    return this.amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    })
  }

  get isExpense(): boolean {
    return this.type.id === TransactionType.EXPENSE
  }

  get isIncome(): boolean {
    return this.type.id === TransactionType.INCOME
  }

  get editInitialFormState(): EditFormType {
    return {
      category: this.category!.id
    }
  }

  public async updateFields(patch: EditFormType) {
    this.category = Category.fromId(patch.category)

    await TransactionService.update(this.id, {
      category: patch.category
    })

    await CounterpartyService.upsertDefaultCategory(
      this.description,
      patch.category
    )

    updatePaginatedQuery(this, this.queryKey)
  }

  public async remove() {
    await TransactionService.delete(this.id)
  }
}
