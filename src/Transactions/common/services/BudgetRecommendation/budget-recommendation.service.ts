import { TransactionService } from '@/Transactions/common/services/Transactions/transaction.service'
import type { TransactionDTO } from '@/Transactions/common/services/Transactions/transaction.types'

const EXPENSE_TYPE = 2

/** Returns YYYY-MM for the month before the given YYYY-MM. */
function prevMonth(selectedDate: string): string {
  const [y, m] = selectedDate.split('-').map(Number)
  if (m === 1) return `${y - 1}-12`
  return `${y}-${String(m - 1).padStart(2, '0')}`
}

/** Sum expense amounts by category for a list of transactions. */
function sumExpensesByCategory(items: TransactionDTO[]): Record<number, number> {
  const byCategory: Record<number, number> = {}
  for (const t of items) {
    if (t.type !== EXPENSE_TYPE) continue
    const cat = t.category
    byCategory[cat] = (byCategory[cat] ?? 0) + t.amount
  }
  return byCategory
}

export type RecommendedBudgetsParams = {
  selectedDate: string
  billingDueDay?: number
}

/**
 * Recommends budget limits per category from the last 3 billing cycles (or months).
 * Returns categoryId -> limitCents (average of the 3 periods' spending, rounded).
 */
export const BudgetRecommendationService = {
  getRecommendedLimitCents: async (
    params: RecommendedBudgetsParams
  ): Promise<Record<number, number>> => {
    const { selectedDate, billingDueDay } = params
    const period1 = selectedDate
    const period2 = prevMonth(period1)
    const period3 = prevMonth(period2)

    const [r1, r2, r3] = await Promise.all([
      TransactionService.readManyFiltered({
        selectedDate: period1,
        billingDueDay
      }),
      TransactionService.readManyFiltered({
        selectedDate: period2,
        billingDueDay
      }),
      TransactionService.readManyFiltered({
        selectedDate: period3,
        billingDueDay
      })
    ])

    const byCat1 = sumExpensesByCategory(r1.items)
    const byCat2 = sumExpensesByCategory(r2.items)
    const byCat3 = sumExpensesByCategory(r3.items)

    const allCategoryIds = new Set<number>([
      ...Object.keys(byCat1).map(Number),
      ...Object.keys(byCat2).map(Number),
      ...Object.keys(byCat3).map(Number)
    ])

    const result: Record<number, number> = {}
    for (const categoryId of allCategoryIds) {
      const s1 = byCat1[categoryId] ?? 0
      const s2 = byCat2[categoryId] ?? 0
      const s3 = byCat3[categoryId] ?? 0
      const average = (s1 + s2 + s3) / 3
      result[categoryId] = Math.round(average * 100)
    }
    return result
  }
}
