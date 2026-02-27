import { Category } from '@/Transactions/common/enums'

/** Categorias consideradas despesas fixas (Moradia, Saúde, Assinaturas). */
export const FIXED_EXPENSE_CATEGORY_IDS = [
  Category.MORADIA,
  Category.SAUDE,
  Category.ASSINATURAS
] as const

export function isFixedExpenseCategory(categoryId: number): boolean {
  return (FIXED_EXPENSE_CATEGORY_IDS as readonly number[]).includes(categoryId)
}
