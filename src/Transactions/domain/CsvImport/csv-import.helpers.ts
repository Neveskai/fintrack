import { Category, CategoryEnum } from '@/Transactions/common/enums'
import { rules } from './csv-import.constants'

export type ClassificationRule = { category: number; keywords: string[] }

/**
 * Returns true if description matches the keyword.
 * Keywords ending with * are prefix matches (e.g. "ifd*" matches "IFD RESTAURANTE").
 * Otherwise the keyword must be contained in the description.
 */
function matchesKeyword(descriptionLower: string, keyword: string): boolean {
  const kw = keyword.toLowerCase().trim()
  if (kw.endsWith('*')) {
    const prefix = kw.slice(0, -1)
    return prefix.length > 0 && descriptionLower.startsWith(prefix)
  }
  return descriptionLower.includes(kw)
}

export function categorizeByDescription(
  description: string,
  rulesOverride?: ClassificationRule[]
): CategoryEnum {
  const lower = description.toLowerCase()
  const activeRules = rulesOverride?.length ? rulesOverride : rules

  for (const rule of activeRules) {
    if (rule.keywords.some(kw => matchesKeyword(lower, kw))) {
      return rule.category as CategoryEnum
    }
  }

  return Category.OUTROS
}
