import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { VStack, Text, Button, Page, Box, Dialog, Portal, HStack, FeatureCard } from '@/common/ui'
import { TransactionService } from '@/Transactions/common/services/Transactions/transaction.service'
import { TransactionItem } from './ListItem'
import { Transaction } from '@/Transactions/domain/Transaction'
import { Header } from '@/Transactions/pages/List/Header'
import { Filters } from '@/Transactions/pages/List/Filters'
import { GroupedRow, type GroupedRowData } from './GroupedRow'
import { useTheme } from 'next-themes'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { TransactionRoutes } from '@/Transactions/transactions.routes'
import { BsFunnel, BsListUl } from 'react-icons/bs'
import { QueryKeys } from '../../common/constants/query-keys'
import { formatMonthYear } from '@/Transactions/common/constants'
import { useListFiltersStore } from '../../stores'
import type { GroupByOption } from '../../stores'
import { EditTransactionDialog, CategoryDrawer, MonthSelector } from '../../common/ui'
import { useListFilterSearchParams, buildListFilterParams } from '../../common/hooks'
import { AnimatedList, AnimatedListItem } from '@/common/ui/Animations'
import { useUserSettings, useLoadingTimeout } from '@/common/hooks'
import { useAuthStore } from '@/common/stores'
import { Category } from '@/Transactions/common/enums'
import { FiUpload } from 'react-icons/fi'
import { TransactionsEmptyOrErrorState } from './TransactionsEmptyOrErrorState'

const SIZE = 20
const LOADING_TIMEOUT_MS = 4000

export const TransactionList = () => {
  useListFilterSearchParams()
  const [, setSearchParams] = useSearchParams()
  const { category, selectedDate, setSelectedDate, sortBy, sortDirection, searchText, groupBy } =
    useListFiltersStore()
  const { creditCardDueDay } = useUserSettings()
  const { user, loading: authLoading } = useAuthStore()
  const isGrouped = groupBy !== 'none'
  const queryEnabled = !!user && !authLoading
  const [groupSortBy, setGroupSortBy] = useState<'label' | 'amount'>('amount')
  const [groupSortDirection, setGroupSortDirection] = useState<'asc' | 'desc'>('desc')

  const billingDueDay = creditCardDueDay ?? undefined

  const queryKeyPaginated = useMemo(
    () => [
      QueryKeys.TRANSACTIONS_PAGINATED,
      sortBy,
      sortDirection,
      category,
      selectedDate,
      billingDueDay,
      searchText
    ],
    [sortBy, sortDirection, category, selectedDate, billingDueDay, searchText]
  )

  const queryKeyGrouped = useMemo(
    () => [
      QueryKeys.TRANSACTIONS_LIST_GROUPED,
      groupBy,
      sortBy,
      sortDirection,
      category,
      selectedDate,
      billingDueDay,
      searchText
    ],
    [groupBy, sortBy, sortDirection, category, selectedDate, billingDueDay, searchText]
  )

  const filters = useMemo(
    () => ({
      category: category ? Number(category) : undefined,
      selectedDate: selectedDate?.toISOString().split('T')[0],
      billingDueDay,
      searchText: searchText?.trim() || undefined
    }),
    [category, selectedDate, billingDueDay, searchText]
  )

  const sort = useMemo(() => ({ sortBy, sortDirection }), [sortBy, sortDirection])

  const infinite = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: queryKeyPaginated,
    queryFn: ({ pageParam = 0 }: { pageParam: number }) => {
      return TransactionService.readManyPaginated(
        filters,
        { page: pageParam, size: SIZE },
        sort
      )
    },
    getNextPageParam: (lastPage, allPages) => {
      const isLastPage = lastPage.items.length < SIZE
      return isLastPage ? undefined : allPages.length
    },
    select: data => ({
      pageParams: data.pageParams,
      pages: data.pages.map(page => ({
        ...page,
        items: page.items.map(t => new Transaction(t, queryKeyPaginated))
      }))
    }),
    gcTime: 0,
    staleTime: 0,
    enabled: queryEnabled && !isGrouped
  })

  const groupedResponse = useQuery({
    queryKey: queryKeyGrouped,
    queryFn: () => TransactionService.readManyFiltered(filters, sort),
    enabled: queryEnabled && isGrouped,
    gcTime: 0,
    staleTime: 0
  })

  const data = infinite.data
  const transactions = data?.pages.flatMap(page => page.items) || []
  const totalIncome = data?.pages[0]?.totalIncome ?? 0
  const totalExpense = data?.pages[0]?.totalExpense ?? 0
  const totalCount = data?.pages[0]?.totalCount ?? 0

  const groupedData = groupedResponse.data
  const groupedRows = useMemo((): GroupedRowData[] => {
    if (!isGrouped || !groupedData?.items.length) return []
    const items = groupedData.items
    const map = new Map<
      string,
      { sum: number; categoryId?: number; categoryName?: string }
    >()
    for (const t of items) {
      const key =
        groupBy === 'date'
          ? t.date
          : groupBy === 'category'
            ? String(t.category)
            : (t.description ?? '').trim() || '(sem descrição)'
      const signed = t.type === 2 ? -t.amount : t.amount
      const existing = map.get(key)
      if (existing) {
        existing.sum += signed
      } else {
        const categoryId = groupBy === 'category' ? t.category : undefined
        const categoryName =
          categoryId != null
            ? (Category.fromId(categoryId as Parameters<typeof Category.fromId>[0])?.name ??
              `Categoria ${categoryId}`)
            : undefined
        map.set(key, {
          sum: signed,
          categoryId,
          categoryName
        })
      }
    }
    const rows: GroupedRowData[] = Array.from(map.entries()).map(
      ([key, { sum, categoryId, categoryName }]) => ({
        groupBy: groupBy as GroupByOption,
        key,
        sum,
        categoryId,
        categoryName
      })
    )
    const dir = groupSortDirection === 'asc' ? 1 : -1
    rows.sort((a, b) => {
      if (groupSortBy === 'amount') {
        return (a.sum - b.sum) * dir
      }
      const labelA = groupBy === 'category' ? (a.categoryName ?? a.key) : a.key
      const labelB = groupBy === 'category' ? (b.categoryName ?? b.key) : b.key
      return labelA.localeCompare(labelB, undefined, { numeric: true }) * dir
    })
    return rows
  }, [isGrouped, groupBy, groupedData?.items, groupSortBy, groupSortDirection])

  const isLoading = isGrouped ? groupedResponse.isLoading : infinite.isLoading
  const isError = isGrouped ? groupedResponse.isError : infinite.isError
  const refetch = isGrouped ? groupedResponse.refetch : infinite.refetch
  const loadingTimedOut = useLoadingTimeout(isLoading, LOADING_TIMEOUT_MS)
  const showEmptyOrError = isError
  const isLoadingSpinner = authLoading || (isLoading && !loadingTimedOut)
  const displayTotalIncome = isGrouped ? (groupedData?.totalIncome ?? 0) : totalIncome
  const displayTotalExpense = isGrouped ? (groupedData?.totalExpense ?? 0) : totalExpense
  const displayTotalCount = isGrouped ? (groupedData?.totalCount ?? 0) : totalCount

  const handleGroupSort = useCallback((column: 'label' | 'amount') => {
    setGroupSortBy(prev => {
      if (prev === column) {
        setGroupSortDirection(d => (d === 'asc' ? 'desc' : 'asc'))
        return prev
      }
      setGroupSortDirection(column === 'amount' ? 'desc' : 'asc')
      return column
    })
  }, [])

  const loadMoreRef = useCallback(
    (node: HTMLDivElement) => {
      if (infinite.isFetchingNextPage || !infinite.hasNextPage) return

      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          infinite.fetchNextPage()
        }
      })

      if (node) observer.observe(node)

      return () => {
        if (node) observer.unobserve(node)
      }
    },
    [infinite.isFetchingNextPage, infinite.hasNextPage, infinite.fetchNextPage]
  )

  const { resolvedTheme } = useTheme()
  const borderColor = resolvedTheme === 'light' ? 'gray.200' : 'gray.700'
  const navigate = useNavigate()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [categoryDrawerTransaction, setCategoryDrawerTransaction] =
    useState<Transaction | null>(null)

  return (
    <Page.Root isLoading={isLoadingSpinner} isError={false}>
      <Page.Header
        breadcrumb={[
          { label: 'Início', href: '/' },
          { label: 'Transações' }
        ]}
        title={formatMonthYear(selectedDate ?? new Date())}
        description="Visualize e gerencie suas transações financeiras"
        action={
          <HStack gap={2} flexShrink={0}>
            <MonthSelector
              value={selectedDate}
              onChange={date => {
                setSelectedDate(date)
                setSearchParams(
                  buildListFilterParams({
                    selectedDate: date,
                    category,
                    searchText,
                    sortBy,
                    sortDirection,
                    groupBy
                  }),
                  { replace: true }
                )
              }}
            />
            <Button
              size="sm"
              colorPalette="purple"
              onClick={() => navigate(TransactionRoutes.Import)}
            >
             Importar CSV <FiUpload />
            </Button>
          </HStack>
        }
      />

      <Page.Filters>
        <Box display={{ base: 'none', md: 'block' }} w="100%">
          <Filters />
        </Box>
        <Box display={{ base: 'flex', md: 'none' }} alignItems="center" w="100%">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltersOpen(true)}
            gap={2}
          >
            <BsFunnel />
            <Text>Filtros</Text>
          </Button>
          <Dialog.Root open={filtersOpen} onOpenChange={e => setFiltersOpen(e.open)}>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content maxW={{ base: '100vw', sm: '95vw' }} mx={{ base: 0, sm: 'auto' }}>
                  <Dialog.Header>
                    <Dialog.Title>Filtros</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <VStack align="stretch" gap={3}>
                      <Filters />
                    </VStack>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Button variant="outline" onClick={() => setFiltersOpen(false)}>
                      Fechar
                    </Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </Box>
      </Page.Filters>

      <Page.Body gap={4}>
        {showEmptyOrError ? (
          <TransactionsEmptyOrErrorState onRetry={() => refetch()} />
        ) : (
          <>
        <FeatureCard
          title="Sua lista de transações"
          description="Aqui você tem visão completa do que entra e sai. Use filtros, agrupamentos e ordenação para entender melhor seus gastos."
          icon={<BsListUl size={24} />}
        >
          <Text fontSize="sm">
            <strong>Filtros:</strong> por categoria, período e busca por texto.
          </Text>
          <Text fontSize="sm">
            <strong>Agrupar por:</strong> data, categoria ou descrição para ver totais de cada grupo.
          </Text>
          <Text fontSize="sm">
            <strong>Ordenação:</strong> por valor, data ou descrição, ascendente ou descendente.
          </Text>
          <Text fontSize="sm">
            <strong>Importar CSV:</strong> adicione transações em lote pelo botão no topo da página.
          </Text>
        </FeatureCard>

        <VStack
          gap={0}
          align="stretch"
          border="xs"
          borderColor={borderColor}
          bg="Background"
          borderRadius="xs"
          minW={0}
        >
          <Header
            totalIncome={displayTotalIncome}
            totalExpense={displayTotalExpense}
            count={displayTotalCount}
            groupBy={groupBy}
            groupCount={isGrouped ? groupedRows.length : undefined}
            groupSortBy={groupSortBy}
            groupSortDirection={groupSortDirection}
            onGroupSort={handleGroupSort}
          />

          {isGrouped ? (
            <AnimatedList>
              {groupedRows.map((row, index) => (
                <AnimatedListItem key={`${row.groupBy}-${row.key}-${index}`}>
                  <GroupedRow data={row} />
                </AnimatedListItem>
              ))}
            </AnimatedList>
          ) : (
            <AnimatedList>
              {transactions.map(transaction => (
                <AnimatedListItem key={transaction.id}>
                  <TransactionItem
                    transaction={transaction}
                    onOpenCategoryDrawer={setCategoryDrawerTransaction}
                  />
                </AnimatedListItem>
              ))}
            </AnimatedList>
          )}
          {!isGrouped && infinite.hasNextPage && (
            <div ref={loadMoreRef} style={{ height: 20 }} />
          )}
        </VStack>

        <EditTransactionDialog />
        <CategoryDrawer
          open={!!categoryDrawerTransaction}
          onOpenChange={open => !open && setCategoryDrawerTransaction(null)}
          transaction={categoryDrawerTransaction}
        />
          </>
        )}
      </Page.Body>
    </Page.Root>
  )
}
