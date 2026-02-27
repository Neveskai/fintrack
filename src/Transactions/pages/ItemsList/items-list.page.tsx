import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Box, Page, VStack, Text, Button, Dialog, Portal, FeatureCard } from '@/common/ui'
import { useTheme } from 'next-themes'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { TransactionItemService } from '@/Transactions/common/services/TransactionItems'
import { TransactionService } from '@/Transactions/common/services/Transactions/transaction.service'
import { ItemsListHeader } from './Header'
import { ItemsListFilters } from './Filters'
import { ItemRow } from './ItemRow'
import { MonthSelector } from '@/Transactions/common/ui'
import { useItemListFilterSearchParams, buildItemListFilterParams } from '@/Transactions/common/hooks'
import { useItemListFiltersStore } from '@/Transactions/stores'
import { QueryKeys } from '@/Transactions/common/constants/query-keys'
import { formatMonthYear } from '@/Transactions/common/constants'
import { TransactionRoutes } from '@/Transactions/transactions.routes'
import { AnimatedList, AnimatedListItem } from '@/common/ui/Animations'
import { BsFunnel, BsBoxSeam } from 'react-icons/bs'
import { ItemsListEmptyState } from './ItemsListEmptyState'

function sameMonthAs(transactionDate: string | undefined, selectedDate: Date | null): boolean {
  if (!transactionDate || !selectedDate) return true
  const [y, m] = selectedDate.toISOString().split('T')[0].split('-')
  return transactionDate.startsWith(`${y}-${m}`)
}

export const ItemsListPage = () => {
  useItemListFilterSearchParams()
  const [, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { searchText, selectedDate, setSelectedDate, sortBy, sortDirection } = useItemListFiltersStore()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filters = useMemo(
    () => ({
      searchText: searchText?.trim() || undefined,
      sortBy,
      sortDirection
    }),
    [searchText, sortBy, sortDirection]
  )

  const queryKey = useMemo(
    () => [QueryKeys.ITEMS_LIST, filters],
    [filters]
  )

  const itemsQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const items = await TransactionItemService.getAll({
        ...filters,
        limitCount: 500
      })
      const transactionIds = [...new Set(items.map(i => i.transactionId))]
      const transactionsMap = transactionIds.length > 0
        ? await TransactionService.getManyByIds(transactionIds)
        : new Map<string, { date: string; description: string }>()
      return { items, transactionsMap }
    }
  })

  const { data, isLoading, isError, refetch } = itemsQuery
  const rawItems = data?.items ?? []
  const transactionsMap = data?.transactionsMap ?? new Map()
  const items = useMemo(
    () =>
      selectedDate
        ? rawItems.filter(item =>
            sameMonthAs(transactionsMap.get(item.transactionId)?.date, selectedDate)
          )
        : rawItems,
    [rawItems, transactionsMap, selectedDate]
  )
  const totalAmount = items.reduce((sum, i) => sum + i.amount, 0)
  const { resolvedTheme } = useTheme()
  const borderColor = resolvedTheme === 'light' ? 'gray.200' : 'gray.700'

  return (
    <Page.Root isLoading={isLoading} isError={false} onErrorRetry={() => refetch()}>
      <Page.Header
        breadcrumb={[
          { label: 'Início', href: TransactionRoutes.Home },
          { label: 'Itens' }
        ]}
        title={formatMonthYear(selectedDate ?? new Date())}
        description="Listagem de itens de todas as transações"
        action={
          <MonthSelector
            value={selectedDate}
            onChange={date => {
              setSelectedDate(date)
              setSearchParams(
                buildItemListFilterParams({
                  searchText,
                  selectedDate: date,
                  sortBy,
                  sortDirection
                }),
                { replace: true }
              )
            }}
          />
        }
      />

      <Page.Filters>
        <Box display={{ base: 'none', md: 'block' }} w="100%">
          <ItemsListFilters />
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
                      <ItemsListFilters />
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
        <FeatureCard
          title="Itens das suas transações"
          description="Cada transação pode ter vários itens (produtos ou serviços). Aqui você vê todos eles em uma única lista, com totais e filtros por período."
          icon={<BsBoxSeam size={24} />}
        >
          <Text fontSize="sm">
            <strong>Período:</strong> use o seletor de mês no topo para ver apenas itens do mês escolhido.
          </Text>
          <Text fontSize="sm">
            <strong>Busca:</strong> filtre itens pelo texto da descrição.
          </Text>
          <Text fontSize="sm">
            <strong>Ordenação:</strong> por valor ou descrição para encontrar rapidamente o que precisa.
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
          <ItemsListHeader count={items.length} totalAmount={totalAmount} />
          <AnimatedList>
            {!isLoading && (items.length === 0 || isError) ? (
              <ItemsListEmptyState
                onNavigateToTransactions={() => navigate(TransactionRoutes.Transactions)}
                isError={isError}
                onRetry={() => refetch()}
              />
            ) : (
              items.map(item => (
                <AnimatedListItem key={`${item.transactionId}-${item.id}`}>
                  <ItemRow
                    item={item}
                    transactionInfo={transactionsMap.get(item.transactionId)}
                  />
                </AnimatedListItem>
              ))
            )}
          </AnimatedList>
        </VStack>
      </Page.Body>
    </Page.Root>
  )
}
