export abstract class TransactionType {
  public static readonly INCOME = 1 as const
  public static readonly EXPENSE = 2 as const

  public static readonly VALUES = [
    { id: 1 as const, name: 'Entrada' },
    { id: 2 as const, name: 'Saída' }
  ] as const

  public static fromId(id: TransactionTypeEnum) {
    return this.VALUES.find(option => option.id === id) as TransactionTypeValue
  }

  public static fromAmount(amount: number): TransactionTypeValue {
    return amount >= 0
      ? this.fromId(this.INCOME)
      : this.fromId(this.EXPENSE)
  }
}

export type TransactionTypeValue = (typeof TransactionType.VALUES)[number]
export type TransactionTypeEnum = TransactionTypeValue['id']
