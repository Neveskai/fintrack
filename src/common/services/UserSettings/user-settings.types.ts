export type ClassificationRuleDTO = {
  category: number
  keywords: string[]
}

export type CustomCategoryDTO = {
  id: number
  name: string
}

export type BudgetDTO = {
  categoryId: number
  limitCents: number
}

export type UserSettingsDTO = {
  creditCardDueDay?: number
  classificationRules?: ClassificationRuleDTO[]
  customCategories?: CustomCategoryDTO[]
  budgets?: BudgetDTO[]
}
