import { useMemo, useState, useEffect } from 'react'
import { Box, Button, Text, VStack, HStack, Input, FeatureCard } from '@/common/ui'
import { useTheme } from 'next-themes'
import { Category } from '@/Transactions/common/enums'
import { getCategoryIcon } from '@/Transactions/common/constants/colors'
import type { BudgetDTO } from '@/common/services/UserSettings'
import type { Transaction } from '@/Transactions/domain/Transaction'
import { isFixedExpenseCategory } from '../budget.constants'
import { FiPieChart } from 'react-icons/fi'

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })

type BudgetRowProps = {
  label: string
  orcado: number
  realizado: number
  saldo: number
  icon?: React.ReactNode
  isSubtotal?: boolean
  categoryId?: number
  editOrcadoValue?: string | number
  onOrcadoChange?: (value: string) => void
  isEditing?: boolean
  borderColor: string
  rowBg: string
}

const BudgetRow = ({
  label,
  orcado,
  realizado,
  saldo,
  icon,
  isSubtotal,
  categoryId,
  editOrcadoValue,
  onOrcadoChange,
  isEditing,
  borderColor,
  rowBg
}: BudgetRowProps) => (
  <HStack
    w="100%"
    justify="space-between"
    py={2}
    px={3}
    gap={4}
    bg={rowBg}
    _dark={{ bg: 'gray.800' }}
    borderRadius="md"
    borderWidth="1px"
    borderColor={borderColor}
    fontWeight={isSubtotal ? 'semibold' : 'normal'}
    alignItems="center"
  >
    <HStack gap={2} minW={0} flex="1">
      {icon}
      <Text fontSize={isSubtotal ? 'md' : 'sm'} lineClamp={1}>
        {label}
      </Text>
    </HStack>
    <HStack flexShrink={0} gap={{ base: 2, md: 6 }} alignItems="center" h="28px">
      {isEditing && categoryId != null && onOrcadoChange ? (
        <Box minW="110px" w="110px" h="28px" display="flex" alignItems="center">
          <Input
            size="sm"
            type="number"
            step={0.01}
            min={0}
            placeholder="0"
            value={editOrcadoValue != null && Number(editOrcadoValue) > 0 ? editOrcadoValue : ''}
            onChange={e => onOrcadoChange(e.target.value)}
            textAlign="right"
            h="24px"
            minH="24px"
            py={0}
            fontSize="sm"
          />
        </Box>
      ) : (
        <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} minW="110px" w="110px" textAlign="right" whiteSpace="nowrap" lineHeight="28px">
          {formatCurrency(orcado)}
        </Text>
      )}
      <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} minW="110px" w="110px" textAlign="right" whiteSpace="nowrap" lineHeight="28px">
        {formatCurrency(realizado)}
      </Text>
      <Text
        fontSize="sm"
        minW="110px"
        w="110px"
        textAlign="right"
        whiteSpace="nowrap"
        lineHeight="28px"
        color={saldo >= 0 ? 'green.500' : 'red.500'}
      >
        {formatCurrency(saldo)}
      </Text>
    </HStack>
  </HStack>
)

type BudgetOverviewProps = {
  budgets: BudgetDTO[]
  transactions: Transaction[]
  isEditing?: boolean
  onEditClick?: () => void
  onSave?: (limitsByCategory: Record<number, number>) => void
  onCancel?: () => void
  isSaving?: boolean
}

export const BudgetOverview = ({
  budgets,
  transactions,
  isEditing = false,
  onEditClick,
  onSave,
  onCancel,
  isSaving = false
}: BudgetOverviewProps) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [limitsByCategory, setLimitsByCategory] = useState<Record<number, number>>({})

  const budgetMap = useMemo(() => {
    const m: Record<number, number> = {}
    for (const b of budgets) m[b.categoryId] = b.limitCents / 100
    return m
  }, [budgets])

  useEffect(() => {
    const next: Record<number, number> = {}
    for (const b of budgets) next[b.categoryId] = b.limitCents / 100
    const categories = Category.getMergedValues()
    for (const { id } of categories) {
      if (next[id] == null) next[id] = 0
    }
    setLimitsByCategory(next)
  }, [budgets, isEditing])

  const spentByCategory = useMemo(() => {
    const map: Record<number, number> = {}
    for (const t of transactions) {
      if (!t.isExpense || !t.category) continue
      const id = t.category.id
      map[id] = (map[id] ?? 0) + t.amount
    }
    return map
  }, [transactions])

  const categories = Category.getMergedValues()
  const expenseCategories = categories

  const fixedCategories = expenseCategories.filter(c => isFixedExpenseCategory(c.id))
  const variableCategories = expenseCategories.filter(c => !isFixedExpenseCategory(c.id))

  const budgetedFixedIds = new Set(fixedCategories.filter(c => (budgetMap[c.id] ?? 0) > 0).map(c => c.id))
  const budgetedVariableIds = new Set(variableCategories.filter(c => (budgetMap[c.id] ?? 0) > 0).map(c => c.id))
  const unbudgetedFixed = fixedCategories.filter(c => !budgetedFixedIds.has(c.id))
  const unbudgetedVariable = variableCategories.filter(c => !budgetedVariableIds.has(c.id))

  const totalDespesasOrcado = isEditing
    ? Object.values(limitsByCategory).reduce((a, b) => a + b, 0)
    : Object.values(budgetMap).reduce((a, b) => a + b, 0)
  const totalDespesasRealizado = Object.values(spentByCategory).reduce((a, b) => a + b, 0)
  const totalDespesasSaldo = totalDespesasOrcado - totalDespesasRealizado

  const handleLimitChange = (categoryId: number, value: string) => {
    const normalized = value.replace(/,/g, '.')
    const num = value === '' ? 0 : parseFloat(normalized) || 0
    setLimitsByCategory(prev => ({ ...prev, [categoryId]: num }))
  }

  const handleSave = () => {
    const list = Object.entries(limitsByCategory).filter(([, v]) => v > 0)
    const toSave: Record<number, number> = {}
    list.forEach(([id, v]) => { toSave[Number(id)] = v })
    onSave?.(toSave)
  }

  const borderColor = isDark ? 'gray.700' : 'gray.200'
  const rowBg = isDark ? 'gray.800' : 'white'

  return (
    <VStack align="stretch" gap={4} w="100%">
      {/* Salvar/Cancelar só quando estiver editando (Editar fica só no header) */}
      {isEditing && (
        <Box w="100%" display="flex" justifyContent="flex-end">
          <HStack gap={2}>
            <Button size="sm" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button size="sm" colorPalette="orange" onClick={handleSave} loading={isSaving} disabled={isSaving}>
              {isSaving ? 'Salvando…' : 'Salvar'}
            </Button>
          </HStack>
        </Box>
      )}

      {/* Despesas */}
      <Box w="100%">
        <Text fontWeight="medium" fontSize="md" color="fg" mb={2}>
          Despesas
        </Text>

        <FeatureCard
          title="Defina suas Metas de Objetivos"
          description="Crie aqui seu orçamento e acompanhe o progresso no painel."
          icon={<FiPieChart size={24} />}
        >
          <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
            <strong>Orçado</strong> é o limite que você define para cada categoria no mês.{' '}
            <strong>Realizado</strong> é a soma dos gastos já lançados. O <strong>saldo</strong> (orçado − realizado){' '}
            mostra se está dentro do planejado (verde) ou estourando (vermelho).
          </Text>
          <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
            <strong>Fixa</strong> reúne despesas recorrentes (Moradia, Saúde, Assinaturas).{' '}
            <strong>Variável</strong> agrupa as demais categorias. Use o botão Editar no topo para alterar os valores orçados.
          </Text>
          <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
            No <strong>Painel</strong>, o card &quot;Total vs Orçamento&quot; usa esses limites para mostrar quanto do orçamento mensal você já consumiu e se está dentro do planejado. Os totais por categoria aqui refletem o mesmo período (mês de fechamento) do painel.
          </Text>
        </FeatureCard>

        <VStack align="stretch" gap={3} pl={0} mt={4}>
          {/* Fixa */}
          <Box w="100%">
            <HStack
              w="100%"
              justify="space-between"
              align="center"
              mb={1.5}
              pl={2}
              pr={3}
              fontSize="xs"
              color="gray.500"
              _dark={{ color: 'gray.400' }}
              gap={{ base: 2, md: 6 }}
            >
              <Text fontWeight="medium" fontSize="sm" color="fg">
                Fixa
              </Text>
              <HStack flexShrink={0} gap={{ base: 2, md: 6 }}>
                <Text minW="110px" w="110px" textAlign="right">Orçado</Text>
                <Text minW="110px" w="110px" textAlign="right">Realizado</Text>
                <Text minW="110px" w="110px" textAlign="right">Saldo</Text>
              </HStack>
            </HStack>
            <VStack align="stretch" gap={2} pl={2}>
              {(isEditing ? fixedCategories : fixedCategories.filter(c => (budgetMap[c.id] ?? 0) > 0)).map(c => {
                const Icon = getCategoryIcon(c.id)
                const orcado = isEditing ? (limitsByCategory[c.id] ?? 0) : (budgetMap[c.id] ?? 0)
                const realizado = spentByCategory[c.id] ?? 0
                return (
                  <BudgetRow
                    key={c.id}
                    label={c.name}
                    orcado={orcado}
                    realizado={realizado}
                    saldo={orcado - realizado}
                    icon={<Icon size={16} />}
                    categoryId={isEditing ? c.id : undefined}
                    editOrcadoValue={isEditing ? (limitsByCategory[c.id] ?? 0) : undefined}
                    onOrcadoChange={isEditing ? (v) => handleLimitChange(c.id, v) : undefined}
                    isEditing={isEditing}
                    borderColor={borderColor}
                    rowBg={rowBg}
                  />
                )
              })}
              {!isEditing && unbudgetedFixed.map(c => {
                const Icon = getCategoryIcon(c.id)
                const realizado = spentByCategory[c.id] ?? 0
                return (
                  <BudgetRow
                    key={c.id}
                    label={c.name}
                    orcado={0}
                    realizado={realizado}
                    saldo={-realizado}
                    icon={<Icon size={16} />}
                    borderColor={borderColor}
                    rowBg={rowBg}
                  />
                )
              })}
            </VStack>
          </Box>

          {/* Variável */}
          <Box w="100%">
            <HStack
              w="100%"
              justify="space-between"
              align="center"
              mb={1.5}
              pl={2}
              pr={3}
              fontSize="xs"
              color="gray.500"
              _dark={{ color: 'gray.400' }}
              gap={{ base: 2, md: 6 }}
            >
              <Text fontWeight="medium" fontSize="sm" color="fg">
                Variável
              </Text>
              <HStack flexShrink={0} gap={{ base: 2, md: 6 }}>
                <Text minW="110px" w="110px" textAlign="right">Orçado</Text>
                <Text minW="110px" w="110px" textAlign="right">Realizado</Text>
                <Text minW="110px" w="110px" textAlign="right">Saldo</Text>
              </HStack>
            </HStack>
            <VStack align="stretch" gap={2} pl={2}>
              {(isEditing ? variableCategories : variableCategories.filter(c => (budgetMap[c.id] ?? 0) > 0)).map(c => {
                const Icon = getCategoryIcon(c.id)
                const orcado = isEditing ? (limitsByCategory[c.id] ?? 0) : (budgetMap[c.id] ?? 0)
                const realizado = spentByCategory[c.id] ?? 0
                return (
                  <BudgetRow
                    key={c.id}
                    label={c.name}
                    orcado={orcado}
                    realizado={realizado}
                    saldo={orcado - realizado}
                    icon={<Icon size={16} />}
                    categoryId={isEditing ? c.id : undefined}
                    editOrcadoValue={isEditing ? (limitsByCategory[c.id] ?? 0) : undefined}
                    onOrcadoChange={isEditing ? (v) => handleLimitChange(c.id, v) : undefined}
                    isEditing={isEditing}
                    borderColor={borderColor}
                    rowBg={rowBg}
                  />
                )
              })}
              {!isEditing && unbudgetedVariable.map(c => {
                const Icon = getCategoryIcon(c.id)
                const realizado = spentByCategory[c.id] ?? 0
                return (
                  <BudgetRow
                    key={c.id}
                    label={c.name}
                    orcado={0}
                    realizado={realizado}
                    saldo={-realizado}
                    icon={<Icon size={16} />}
                    borderColor={borderColor}
                    rowBg={rowBg}
                  />
                )
              })}
            </VStack>
          </Box>

          <BudgetRow
            label="Total Despesas"
            orcado={totalDespesasOrcado}
            realizado={totalDespesasRealizado}
            saldo={totalDespesasSaldo}
            isSubtotal
            borderColor={borderColor}
            rowBg={rowBg}
          />
        </VStack>
      </Box>
    </VStack>
  )
}
