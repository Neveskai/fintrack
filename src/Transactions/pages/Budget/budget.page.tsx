import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Page, Box } from '@/common/ui'
import { TransactionRoutes } from '@/Transactions/transactions.routes'
import { usePanelFilterSearchParams } from '@/Transactions/common/hooks'
import { useUserSettings } from '@/common/hooks'
import { usePanelFiltersStore } from '@/Transactions/stores'
import { TransactionService } from '@/Transactions/common/services/Transactions/transaction.service'
import { Transaction } from '@/Transactions/domain/Transaction'
import { QueryKeys } from '@/Transactions/common/constants/query-keys'
import { formatMonthYear } from '@/Transactions/common/constants'
import { BudgetHeaderActions } from './BudgetHeader/budget-header.component'
import { BudgetEmptyState } from './BudgetEmptyState/budget-empty-state.component'
import { BudgetOverview } from './BudgetOverview/budget-overview.component'
import type { BudgetDTO } from '@/common/services/UserSettings'

function toSelectedDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export const BudgetPage = () => {
  usePanelFilterSearchParams()
  const { selectedDate } = usePanelFiltersStore()
  const { budgets, setBudgets, isSaving: isSavingBudgets, isSettingsLoading, creditCardDueDay } = useUserSettings()
  const [isEditing, setIsEditing] = useState(false)

  const date = selectedDate ?? new Date()
  const selectedDateStr = toSelectedDateStr(date)
  const billingDueDay = creditCardDueDay ?? undefined

  const { data, isLoading: transactionsLoading } = useQuery({
    queryKey: [QueryKeys.TRANSACTIONS, selectedDateStr, billingDueDay],
    queryFn: () =>
      TransactionService.readManyFiltered(
        { selectedDate: selectedDateStr, billingDueDay },
        undefined
      ),
    select: dto => ({
      ...dto,
      items: dto.items.map(t => new Transaction(t, [QueryKeys.TRANSACTIONS, selectedDateStr]))
    }),
    gcTime: 0,
    staleTime: 0
  })

  const transactions = data?.items ?? []
  const isLoading = isSettingsLoading || transactionsLoading
  const hasBudgets = (budgets?.length ?? 0) > 0

  const handleSaveBudgets = async (limitsByCategory: Record<number, number>) => {
    const list: BudgetDTO[] = Object.entries(limitsByCategory)
      .filter(([, v]) => v > 0)
      .map(([categoryId, v]) => ({
        categoryId: Number(categoryId),
        limitCents: Math.round(v * 100)
      }))
    await setBudgets(list)
    setIsEditing(false)
  }

  return (
    <Page.Root isLoading={isLoading} isError={false}>
      <Page.Header
        breadcrumb={[
          { label: 'Início', href: TransactionRoutes.Home },
          { label: 'Painel', href: TransactionRoutes.Home },
          { label: 'Orçamento' }
        ]}
        title={formatMonthYear(date)}
        description="Gerencie seu orçamento mensal"
        action={
          !isEditing ? (
            <BudgetHeaderActions onEditClick={() => setIsEditing(true)} />
          ) : null
        }
      />

      <Page.Body gap={4}>
        {(hasBudgets || isEditing) ? (
          <Box w="100%" minW={0}>
            <BudgetOverview
              budgets={budgets ?? []}
              transactions={transactions}
              isEditing={isEditing}
              onEditClick={() => setIsEditing(true)}
              onSave={handleSaveBudgets}
              onCancel={() => setIsEditing(false)}
              isSaving={isSavingBudgets}
            />
          </Box>
        ) : (
          <BudgetEmptyState
            selectedDate={date}
            onCreateBudget={() => setIsEditing(true)}
            onCopyFromNextMonth={() => setIsEditing(true)}
          />
        )}
      </Page.Body>
    </Page.Root>
  )
}
