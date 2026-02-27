import { useQuery } from '@tanstack/react-query'
import { Box, Page, Text, EmptyState } from '@/common/ui'
import { MonthSelector } from '@/Transactions/common/ui'
import { TransactionService } from '@/Transactions/common/services/Transactions/transaction.service'
import { Transaction } from '@/Transactions/domain/Transaction'
import { useTheme } from 'next-themes'
import { useSearchParams } from 'react-router-dom'
import { Filters } from './Filters'
import { Budgets } from './Budgets/budgets.component'
import { SumByCategory } from './SumByDepartment/sum-by-category.component'
import { SummaryCard } from './SummaryCard'
import { DailyExpense } from './AverageTicket/average-ticket.component'
import { MonthlyBudgetSummary } from './MonthlyBudgetSummary'
import { RecentTransactions } from './RecentTransactions'
import { QueryKeys } from '@/Transactions/common/constants/query-keys'
import { formatMonthYear } from '@/Transactions/common/constants'
import { usePanelFiltersStore } from '@/Transactions/stores'
import { usePanelFilterSearchParams, buildPanelFilterParams } from '@/Transactions/common/hooks'
import { useUserSettings, useLoadingTimeout } from '@/common/hooks'
import { useAuthStore } from '@/common/stores'
import { TransactionsEmptyOrErrorState } from '@/Transactions/pages/List/TransactionsEmptyOrErrorState'

const LOADING_TIMEOUT_MS = 4000

function getPreviousPeriodDate(selectedDate: Date | null): string | undefined {
  if (!selectedDate) return undefined
  const prev = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
  return prev.toISOString().split('T')[0]
}

export const TransactionPanel = () => {
  usePanelFilterSearchParams()
  const [, setSearchParams] = useSearchParams()
  const { selectedDate, setSelectedDate } = usePanelFiltersStore()
  const { creditCardDueDay, budgets } = useUserSettings()
  const { user, loading: authLoading } = useAuthStore()

  const billingDueDay = creditCardDueDay ?? undefined
  const selectedDateStr = selectedDate?.toISOString().split('T')[0]
  const prevSelectedDateStr = getPreviousPeriodDate(selectedDate)
  const queryEnabled = !!user && !authLoading

  const queryKey = [QueryKeys.TRANSACTIONS, selectedDateStr, billingDueDay]
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: () =>
      TransactionService.readManyPaginated(
        {
          selectedDate: selectedDateStr,
          billingDueDay
        },
        { size: 9999, page: 0 },
        undefined,
        user?.uid
      ),
    select: dto => ({
      ...dto,
      items: dto.items.map(t => new Transaction(t, queryKey))
    }),
    enabled: queryEnabled,
    gcTime: 0,
    staleTime: 0
  })

  const loadingTimedOut = useLoadingTimeout(isLoading, LOADING_TIMEOUT_MS)
  const showEmptyOrError = isError
  const isLoadingSpinner = authLoading || (isLoading && !loadingTimedOut)

  const prevQueryKey = [QueryKeys.TRANSACTIONS, prevSelectedDateStr, billingDueDay]
  const { data: prevData } = useQuery({
    queryKey: prevQueryKey,
    queryFn: () =>
      TransactionService.readManyPaginated(
        {
          selectedDate: prevSelectedDateStr,
          billingDueDay
        },
        { size: 9999, page: 0 },
        undefined,
        user?.uid
      ),
    select: dto => ({
      ...dto,
      items: dto.items.map(t => new Transaction(t, prevQueryKey))
    }),
    enabled: queryEnabled && !!prevSelectedDateStr,
    gcTime: 0,
    staleTime: 0
  })

  const transactions = data?.items || []
  const totalExpense = data?.totalExpense || 0
  const prevTotalExpense = prevData?.totalExpense || 0

  const { resolvedTheme } = useTheme()
  const bgColor = resolvedTheme === 'light' ? 'white' : 'gray.800'
  const headingColor = resolvedTheme === 'light' ? 'gray.800' : 'gray.200'
  const labelColor = resolvedTheme === 'light' ? 'gray.600' : 'gray.400'

  return (
    <Page.Root isLoading={isLoadingSpinner} isError={false}>
      <Page.Header
        breadcrumb={[
          { label: 'Início', href: '/' },
          { label: 'Painel' }
        ]}
        title={formatMonthYear(selectedDate ?? new Date())}
        description={
          <Text color={labelColor} fontSize="md">
            Bem vindo de volta! Visualize seus dados e acompanhe gastos e orçamentos.
          </Text>
        }
        action={
          <MonthSelector
            value={selectedDate}
            onChange={date => {
              setSelectedDate(date)
              setSearchParams(
                prev => {
                  const next = new URLSearchParams(prev)
                  const built = buildPanelFilterParams(date)
                  built.forEach((v, k) => next.set(k, v))
                  if (!built.has('date')) next.delete('date')
                  return next
                },
                { replace: true }
              )
            }}
          />
        }
      />

      {creditCardDueDay != null && (
        <Page.Filters>
          <Filters />
        </Page.Filters>
      )}

      <Page.Body gap={3}>
        {showEmptyOrError ? (
          <TransactionsEmptyOrErrorState onRetry={() => refetch()} />
        ) : (
          <>
        {/* 1ª linha: Total Gasto (com vs anterior), Ticket Médio, Total vs Orçamento */}
        <Box
          w="100%"
          display="grid"
          gridTemplateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          }}
          gap={2}
          minW={0}
        >
          <SummaryCard
            bgColor={bgColor}
            headingColor={headingColor}
            labelColor={labelColor}
            totalExpense={totalExpense}
            previousTotal={prevTotalExpense}
          />
          <DailyExpense
            bgColor={bgColor}
            headingColor={headingColor}
            labelColor={labelColor}
            totalExpense={totalExpense}
            selectedDate={selectedDate ?? null}
          />
          <MonthlyBudgetSummary
            bgColor={bgColor}
            headingColor={headingColor}
            labelColor={labelColor}
            totalExpense={totalExpense}
            budgets={budgets}
          />
        </Box>

        {/* Empty state quando não há transações */}
        {transactions.length === 0 && (
          <EmptyState
            title="Nenhuma transação neste período"
            description="Importe faturas ou adicione transações para ver o painel preenchido."
          />
        )}

        {/* 2ª linha: Gráfico por Categorias (Chakra UI) */}
        <SumByCategory
          transactions={transactions}
          bgColor={bgColor}
          headingColor={headingColor}
          labelColor={labelColor}
        />

        {/* 3ª linha: Orçamentos (2/3) | Transações (1/3) */}
        <Box
          w="100%"
          display="grid"
          gridTemplateColumns={{ base: '1fr', lg: '2fr 1fr' }}
          gap={2}
          minW={0}
        >
          <Budgets
            bgColor={bgColor}
            transactions={transactions}
            budgets={budgets}
            headingColor={headingColor}
            labelColor={labelColor}
          />
          <RecentTransactions
            bgColor={bgColor}
            headingColor={headingColor}
            labelColor={labelColor}
            transactions={transactions}
          />
        </Box>
          </>
        )}
      </Page.Body>
    </Page.Root>
  )
}
