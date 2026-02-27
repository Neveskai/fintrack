import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/common/stores'
import { UserSettingsService } from '@/common/services/UserSettings'
import type {
  ClassificationRuleDTO,
  CustomCategoryDTO,
  BudgetDTO
} from '@/common/services/UserSettings'

const USER_SETTINGS_QUERY_KEY = 'userSettings'

export function useUserSettings() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const userId = user?.uid ?? null

  const query = useQuery({
    queryKey: [USER_SETTINGS_QUERY_KEY, userId],
    queryFn: () => UserSettingsService.get(userId!),
    enabled: !!userId
  })

  const setCreditCardDueDayMutation = useMutation({
    mutationFn: (day: number | undefined) =>
      UserSettingsService.setCreditCardDueDay(userId!, day),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_SETTINGS_QUERY_KEY, userId] })
    }
  })

  const setClassificationRulesMutation = useMutation({
    mutationFn: (rules: ClassificationRuleDTO[]) =>
      UserSettingsService.setClassificationRules(userId!, rules),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_SETTINGS_QUERY_KEY, userId] })
    }
  })

  const setCustomCategoriesMutation = useMutation({
    mutationFn: (categories: CustomCategoryDTO[]) =>
      UserSettingsService.setCustomCategories(userId!, categories),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_SETTINGS_QUERY_KEY, userId] })
    }
  })

  const setBudgetsMutation = useMutation({
    mutationFn: (budgets: BudgetDTO[]) =>
      UserSettingsService.setBudgets(userId!, budgets),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_SETTINGS_QUERY_KEY, userId] })
    }
  })

  return {
    settings: query.data,
    creditCardDueDay: query.data?.creditCardDueDay,
    classificationRules: query.data?.classificationRules ?? undefined,
    customCategories: query.data?.customCategories ?? undefined,
    budgets: query.data?.budgets ?? undefined,
    setCreditCardDueDay: setCreditCardDueDayMutation.mutateAsync,
    setClassificationRules: setClassificationRulesMutation.mutateAsync,
    setCustomCategories: setCustomCategoriesMutation.mutateAsync,
    setBudgets: setBudgetsMutation.mutateAsync,
    isSettingsLoading: query.isLoading,
    isSettingsError: query.isError,
    isSaving:
      setCreditCardDueDayMutation.isPending ||
      setClassificationRulesMutation.isPending ||
      setCustomCategoriesMutation.isPending ||
      setBudgetsMutation.isPending
  }
}
