import { useState, useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Page,
  Box,
  Text,
  VStack,
  HStack,
  Select,
  Input,
  Button,
  IconButton,
  Dialog,
  Portal,
  FeatureCard
} from '@/common/ui'
import { Input as RawInput } from '@chakra-ui/react'
import { TransactionRoutes } from '@/Transactions/transactions.routes'
import { useUserSettings } from '@/common/hooks'
import { Category } from '@/Transactions/common/enums'
import { useCategories } from '@/Transactions/common/hooks'
import {
  TransactionService,
  CounterpartyService
} from '@/Transactions/common/services'
import { rules as defaultRules } from '@/Transactions/domain/CsvImport/csv-import.constants'
import { categorizeByDescription } from '@/Transactions/domain/CsvImport/csv-import.helpers'
import { QueryKeys } from '@/Transactions/common/constants/query-keys'
import { getCategoryIcon, getCategoryChartColor } from '@/Transactions/common/constants/colors'
import { LuTrash2, LuZap, LuSearch, LuTag, LuList, LuStar } from 'react-icons/lu'
import { useTheme } from 'next-themes'

const REPROCESS_BATCH_SIZE = 50

function getCategoryName(id: number): string {
  return Category.fromId(id as Parameters<typeof Category.fromId>[0])?.name ?? `Categoria ${id}`
}

type FilterTab = 'all' | 'system' | 'custom'

export const ClassificationCategoriesPage = () => {
  const {
    isSettingsError,
    isSettingsLoading,
    classificationRules,
    setClassificationRules,
    customCategories,
    setCustomCategories
  } = useUserSettings()

  const { categoryOptions } = useCategories()
  const queryClient = useQueryClient()
  const { resolvedTheme } = useTheme()

  const rules =
    classificationRules && classificationRules.length > 0
      ? classificationRules
      : defaultRules.map(r => ({ category: r.category, keywords: [...r.keywords] }))

  const isUsingDefaultRules = !classificationRules || classificationRules.length === 0

  const [newRuleCategory, setNewRuleCategory] = useState('')
  const [newRuleKeywords, setNewRuleKeywords] = useState('')

  const handleAddRule = useCallback(() => {
    if (!newRuleCategory.trim()) return
    const category = Number(newRuleCategory)
    const keywords = newRuleKeywords
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(Boolean)
    if (keywords.length === 0) return
    const current =
      classificationRules ??
      defaultRules.map(r => ({ category: r.category, keywords: [...r.keywords] }))
    const next = [...current, { category, keywords }]
    setClassificationRules(next)
    setNewRuleCategory('')
    setNewRuleKeywords('')
  }, [newRuleCategory, newRuleKeywords, classificationRules, setClassificationRules])

  const handleRemoveRule = useCallback(
    (index: number) => {
      const current =
        classificationRules ??
        defaultRules.map(r => ({ category: r.category, keywords: [...r.keywords] }))
      const next = current.filter((_, i) => i !== index)
      setClassificationRules(next)
    },
    [classificationRules, setClassificationRules]
  )

  const handleRestoreDefaultRules = useCallback(() => {
    setClassificationRules([])
  }, [setClassificationRules])

  const [reprocessing, setReprocessing] = useState(false)
  const [reprocessResult, setReprocessResult] = useState<{
    updated: number
    total: number
  } | null>(null)
  const [reprocessError, setReprocessError] = useState<string | null>(null)

  const handleReprocessTransactions = useCallback(async () => {
    setReprocessing(true)
    setReprocessError(null)
    setReprocessResult(null)
    try {
      const [counterpartyMap, transactions] = await Promise.all([
        CounterpartyService.getAllAsMap(),
        TransactionService.getAllForRecategorize()
      ])
      const rulesToUse =
        classificationRules?.length ? classificationRules : undefined
      const getCategory = (description: string) => {
        const key = CounterpartyService.normalizeName(description)
        const fromCounterparty = counterpartyMap.get(key)
        if (fromCounterparty !== undefined) return fromCounterparty
        return categorizeByDescription(description, rulesToUse)
      }
      const updates: { id: string; category: number }[] = []
      for (const tx of transactions) {
        const newCategory = getCategory(tx.description)
        if (newCategory !== tx.category) {
          updates.push({ id: tx.id, category: newCategory })
        }
      }
      for (let i = 0; i < updates.length; i += REPROCESS_BATCH_SIZE) {
        const chunk = updates.slice(i, i + REPROCESS_BATCH_SIZE)
        await Promise.all(
          chunk.map(({ id, category }) =>
            TransactionService.update(id, { category })
          )
        )
      }
      setReprocessResult({ updated: updates.length, total: transactions.length })
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TRANSACTIONS] })
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TRANSACTIONS_PAGINATED] })
    } catch (err) {
      setReprocessError(
        err instanceof Error ? err.message : 'Erro ao reprocessar transações.'
      )
    } finally {
      setReprocessing(false)
    }
  }, [classificationRules, queryClient])

  const [categoryDeleteError, setCategoryDeleteError] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createCategoryName, setCreateCategoryName] = useState('')

  const handleAddCategory = useCallback(() => {
    const name = createCategoryName.trim()
    if (!name) return
    const existing = customCategories ?? []
    const nextId = existing.length === 0 ? 1000 : Math.max(...existing.map(c => c.id)) + 1
    setCustomCategories([...existing, { id: nextId, name }])
    setCreateCategoryName('')
    setCreateDialogOpen(false)
  }, [createCategoryName, customCategories, setCustomCategories])

  const handleDeleteCategory = useCallback(
    async (id: number) => {
      setCategoryDeleteError(null)
      const inUse = await TransactionService.hasTransactionsWithCategory(id)
      if (inUse) {
        setCategoryDeleteError(
          'Não é possível excluir: existem transações com esta categoria.'
        )
        return
      }
      const existing = customCategories ?? []
      setCustomCategories(existing.filter(c => c.id !== id))
    },
    [customCategories, setCustomCategories]
  )

  const totalCategories = Category.VALUES.length + (customCategories?.length ?? 0)
  const customCount = customCategories?.length ?? 0

  const [searchQuery, setSearchQuery] = useState('')
  const [filterTab, setFilterTab] = useState<FilterTab>('all')

  const filteredCategories = useMemo(() => {
    const system = Category.VALUES.map(c => ({ ...c, isCustom: false }))
    const custom = (customCategories ?? []).map(c => ({ ...c, isCustom: true }))
    let list = filterTab === 'system' ? system : filterTab === 'custom' ? custom : [...system, ...custom]
    const q = searchQuery.trim().toLowerCase()
    if (q) list = list.filter(c => c.name.toLowerCase().includes(q))
    return list
  }, [filterTab, searchQuery, customCategories])

  const openCreateDialog = useCallback(() => {
    setCreateCategoryName('')
    setCreateDialogOpen(true)
  }, [])

  return (
    <Page.Root isLoading={isSettingsLoading} isError={isSettingsError}>
      <Page.Header
        breadcrumb={[
          { label: 'Início', href: TransactionRoutes.Home },
          { label: 'Configurações', href: TransactionRoutes.Settings },
          { label: 'Categorias' }
        ]}
        title="Categorias"
        description="Organize e automatize suas transações"
        action={
          <Button colorPalette="purple" size="sm" onClick={openCreateDialog}>
            Criar <LuTag /> 
          </Button>
        }
      />

      <Page.Body gap={6}>
        {/* Stats cards */}
        <HStack gap={4} flexWrap="wrap">
          <Box
            flex="1"
            minW="120px"
            maxW="200px"
            p={4}
            borderRadius="xl"
            bg="gray.100"
            _dark={{ bg: 'gray.800' }}
            position="relative"
            overflow="hidden"
          >
            <LuTag size={32} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', opacity: 0.2 }} />
            <Text fontSize="xs" fontWeight={600} color="gray.500" _dark={{ color: 'gray.400' }} textTransform="uppercase" letterSpacing="wider">
              Categorias
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {totalCategories}
            </Text>
          </Box>
          <Box
            flex="1"
            minW="120px"
            maxW="200px"
            p={4}
            borderRadius="xl"
            bg="purple.50"
            _dark={{ bg: 'purple.900/30' }}
            position="relative"
            overflow="hidden"
          >
            <LuList size={32} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
            <Text fontSize="xs" fontWeight={600} color="purple.600" _dark={{ color: 'purple.300' }} textTransform="uppercase" letterSpacing="wider">
              Regras
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {rules.length}
            </Text>
          </Box>
          <Box
            flex="1"
            minW="120px"
            maxW="200px"
            p={4}
            borderRadius="xl"
            bg="orange.50"
            _dark={{ bg: 'orange.900/30' }}
            position="relative"
            overflow="hidden"
          >
            <LuStar size={32} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
            <Text fontSize="xs" fontWeight={600} color="orange.600" _dark={{ color: 'orange.300' }} textTransform="uppercase" letterSpacing="wider">
              Personalizadas
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {customCount}
            </Text>
          </Box>
        </HStack>

        {/* Regras de Categorização */}
        <FeatureCard
          title="Regras de Categorização"
          description="Automatize a categorização de transações na importação CSV"
          icon={<LuZap size={24} />}
        >
          <Text fontSize="xs" color="gray.500" _dark={{ color: 'gray.400' }}>
            Use <strong>*</strong> no final para prefixo (ex.: ifd* = iFood). {isUsingDefaultRules && 'Regras padrão em uso.'}
          </Text>
          {rules.map((rule, index) => (
            <HStack
              key={`${rule.category}-${index}`}
              justify="space-between"
              align="flex-start"
              gap={2}
              p={3}
              borderRadius="md"
              bg="white"
              _dark={{ bg: 'gray.700' }}
            >
              <VStack align="stretch" gap={0} flex={1} minW={0}>
                <Text fontSize="sm" fontWeight={500}>{getCategoryName(rule.category)}</Text>
                <Text fontSize="xs" color="gray.500">{rule.keywords.join(', ')}</Text>
              </VStack>
              {!isUsingDefaultRules && (
                <IconButton
                  size="sm"
                  variant="ghost"
                  colorPalette="red"
                  onClick={() => handleRemoveRule(index)}
                  aria-label="Remover regra"
                >
                  <LuTrash2 />
                </IconButton>
              )}
            </HStack>
          ))}
          <HStack gap={2} flexWrap="wrap" align="flex-end">
            <Box minW="160px">
              <Select
                label="Categoria"
                placeholder="Selecione"
                value={newRuleCategory}
                onChange={setNewRuleCategory}
                options={categoryOptions}
              />
            </Box>
            <Box flex={1} minW="200px">
              <Input
                label="Palavras-chave (vírgula)"
                placeholder="ex: supermercado, ifd*"
                value={newRuleKeywords}
                onChange={e => setNewRuleKeywords(e.target.value)}
              />
            </Box>
            <Button
              colorPalette="purple"
              onClick={handleAddRule}
              disabled={!newRuleCategory.trim() || !newRuleKeywords.trim()}
            >
              Adicionar regra
            </Button>
          </HStack>
          {!isUsingDefaultRules && (
            <Button variant="outline" size="sm" onClick={handleRestoreDefaultRules}>
              Restaurar padrão
            </Button>
          )}
          <HStack gap={2} align="center" flexWrap="wrap">
            <Button
              variant="outline"
              size="sm"
              colorPalette="purple"
              onClick={handleReprocessTransactions}
              disabled={reprocessing}
            >
              {reprocessing ? 'Reprocessando…' : 'Reprocessar transações'}
            </Button>
            {reprocessResult !== null && (
              <Text fontSize="sm" color="green.600" _dark={{ color: 'green.400' }}>
                {reprocessResult.updated === 0 ? 'Nenhuma alteração.' : `${reprocessResult.updated} de ${reprocessResult.total} atualizadas.`}
              </Text>
            )}
            {reprocessError && <Text fontSize="sm" color="red.500">{reprocessError}</Text>}
          </HStack>
        </FeatureCard>

        {/* Search */}
        <HStack
          gap={2}
          px={3}
          py={2}
          borderRadius="lg"
          bg="gray.100"
          _dark={{ bg: 'gray.800' }}
          alignItems="center"
        >
          <Box color="gray.500" _dark={{ color: 'gray.400' }}>
            <LuSearch size={20} />
          </Box>
          <RawInput
            placeholder="Buscar categorias..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            flex={1}
            minW={0}
            bg="transparent"
            border="none"
            _focus={{ boxShadow: 'none' }}
            _focusVisible={{ boxShadow: 'none' }}
          />
        </HStack>

        {/* Filter tabs */}
        <HStack gap={1} p={1} borderRadius="lg" bg="gray.100" _dark={{ bg: 'gray.800' }} w="fit-content">
          {(['all', 'system', 'custom'] as const).map(tab => (
            <Button
              key={tab}
              size="sm"
              variant={filterTab === tab ? 'solid' : 'ghost'}
              colorPalette={filterTab === tab ? 'gray' : 'gray'}
              bg={filterTab === tab ? (resolvedTheme === 'dark' ? 'gray.700' : 'white') : 'transparent'}
              _dark={{ bg: filterTab === tab ? 'gray.600' : 'transparent' }}
              onClick={() => setFilterTab(tab)}
            >
              {tab === 'all' ? 'Todas' : tab === 'system' ? 'Sistema' : 'Personalizadas'}
            </Button>
          ))}
        </HStack>

        {/* Category list */}
        {categoryDeleteError && (
          <Text fontSize="sm" color="red.500" fontWeight={500}>
            {categoryDeleteError}
          </Text>
        )}
        <VStack align="stretch" gap={2}>
          {filteredCategories.map(c => {
            const Icon = c.isCustom ? LuTag : getCategoryIcon(c.id)
            const colorToken = getCategoryChartColor(c.id)
            const colorBase = colorToken.split('.')[0] ?? 'gray'
            return (
              <HStack
                key={c.id}
                justify="space-between"
                align="center"
                p={3}
                borderRadius="xl"
                bg="gray.50"
                _dark={{ bg: 'gray.800' }}
                gap={3}
              >
                <HStack gap={3} minW={0} flex={1}>
                  <Box
                    p={2}
                    borderRadius="lg"
                    bg={`${colorBase}.100`}
                    _dark={{ color: `${colorBase}.400`, bg: `${colorBase}.900` }}
                    color={`${colorBase}.600`}
                  >
                    <Icon size={20} />
                  </Box>
                  <VStack align="stretch" gap={0} minW={0} flex={1}>
                    <Text fontSize="sm" fontWeight={500} truncate>
                      {c.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {c.isCustom ? 'Personalizada' : 'Sistema'}
                    </Text>
                  </VStack>
                </HStack>
                {c.isCustom && (
                  <IconButton
                    size="sm"
                    variant="ghost"
                    colorPalette="red"
                    onClick={() => handleDeleteCategory(c.id)}
                    aria-label={`Excluir ${c.name}`}
                  >
                    <LuTrash2 />
                  </IconButton>
                )}
              </HStack>
            )
          })}
        </VStack>

      </Page.Body>

      <Dialog.Root open={createDialogOpen} onOpenChange={e => setCreateDialogOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Criar categoria</Dialog.Title>
                <Dialog.CloseTrigger />
              </Dialog.Header>
              <Dialog.Body>
                <Input
                  label="Nome"
                  placeholder="Ex.: Viagens"
                  value={createCategoryName}
                  onChange={e => setCreateCategoryName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                />
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button colorPalette="green" onClick={handleAddCategory} disabled={!createCategoryName.trim()}>
                  Criar
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Page.Root>
  )
}
