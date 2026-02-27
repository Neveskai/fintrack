import { TransactionType } from '@/Transactions/common/enums'
import type { CategoryEnum } from '@/Transactions/common/enums'
import type { CreateTransactionPayload } from '@/Transactions/common/services'
import { categorizeByDescription } from './csv-import.helpers'

export type CsvParsedRow = {
  date: string
  description: string
  amount: number
}

export class CsvImport {
  public readonly rows: CsvParsedRow[]

  constructor(csvText: string) {
    this.rows = CsvImport.parseCreditCard(csvText)
  }

  get count(): number {
    return this.rows.length
  }

  public toPayloads(
    getCategory?: (description: string) => CategoryEnum | undefined
  ): CreateTransactionPayload[] {
    return this.rows.map(row => {
      // Cartão de crédito: valor positivo = gasto (saída)
      const isExpense = row.amount > 0

      const category =
        getCategory?.(row.description) ?? categorizeByDescription(row.description)

      return {
        date: row.date,
        description: row.description,
        amount: Math.abs(row.amount),
        type: isExpense ? TransactionType.EXPENSE : TransactionType.INCOME,
        category
      }
    })
  }

  private static parseCreditCard(text: string): CsvParsedRow[] {
    const lines = text.trim().split('\n')
    const rows: CsvParsedRow[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const match = line.match(/^(\d{4}-\d{2}-\d{2}),(.+),(-?[\d.]+)$/)

      if (!match) {
        const quotedMatch = line.match(
          /^(\d{4}-\d{2}-\d{2}),"(.+)",(-?[\d.]+)$/
        )
        if (quotedMatch) {
          const [, date, description, amountRaw] = quotedMatch
          const amount = parseFloat(amountRaw)
          if (!isNaN(amount)) rows.push({ date, description, amount })
        }
        continue
      }

      const [, date, description, amountRaw] = match
      const amount = parseFloat(amountRaw)

      if (!isNaN(amount)) {
        rows.push({ date, description, amount })
      }
    }

    return rows
  }
}
