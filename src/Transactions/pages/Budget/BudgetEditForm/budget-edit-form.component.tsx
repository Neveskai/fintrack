import { useEffect, useRef, useState } from 'react'
import { Box, Text, VStack, Button, Input } from '@/common/ui'
import { useUserSettings } from '@/common/hooks'
import { usePanelFiltersStore } from '@/Transactions/stores'
import { Category } from '@/Transactions/common/enums'
import { BudgetRecommendationService } from '@/Transactions/common/services/BudgetRecommendation/budget-recommendation.service'
import type { BudgetDTO } from '@/common/services/UserSettings'

function toSelectedDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

type BudgetEditFormProps = {
  onSaved: () => void
  onCancel: () => void
}

export const BudgetEditForm = ({ onSaved, onCancel }: BudgetEditFormProps) => {
  const { selectedDate } = usePanelFiltersStore()
  const {
    budgets: existingBudgets,
    creditCardDueDay,
    setBudgets,
    isSaving
  } = useUserSettings()

  const [limitsByCategory, setLimitsByCategory] = useState<Record<number, number>>({})
  const [recommendation, setRecommendation] = useState<Record<number, number> | null>(null)
  const [recommendationLoading, setRecommendationLoading] = useState(true)
  const [recommendationError, setRecommendationError] = useState<string | null>(null)
  const hasInitialized = useRef(false)

  const selectedDateStr = selectedDate ? toSelectedDateStr(selectedDate) : toSelectedDateStr(new Date())

  useEffect(() => {
    let cancelled = false
    setRecommendationLoading(true)
    setRecommendationError(null)
    BudgetRecommendationService.getRecommendedLimitCents({
      selectedDate: selectedDateStr,
      billingDueDay: creditCardDueDay
    })
      .then(data => {
        if (!cancelled) setRecommendation(data)
      })
      .catch(() => {
        if (!cancelled) setRecommendationError('Não foi possível carregar as recomendações.')
      })
      .finally(() => {
        if (!cancelled) setRecommendationLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedDateStr, creditCardDueDay])

  useEffect(() => {
    if (recommendationLoading || hasInitialized.current) return
    const existingMap: Record<number, number> = {}
    for (const b of existingBudgets ?? []) {
      existingMap[b.categoryId] = b.limitCents / 100
    }
    const merged: Record<number, number> = {}
    const categories = Category.getMergedValues()
    for (const { id } of categories) {
      if (existingMap[id] != null) {
        merged[id] = existingMap[id]
      } else if (recommendation?.[id] != null) {
        merged[id] = recommendation[id] / 100
      }
    }
    setLimitsByCategory(merged)
    hasInitialized.current = true
  }, [recommendation, existingBudgets, recommendationLoading])

  const categories = Category.getMergedValues()

  const handleChange = (categoryId: number, value: string) => {
    const normalized = value.replace(/,/g, '.')
    const num = value === '' ? 0 : parseFloat(normalized) || 0
    setLimitsByCategory(prev => ({ ...prev, [categoryId]: num }))
  }

  const handleSave = async () => {
    const list: BudgetDTO[] = Object.entries(limitsByCategory)
      .filter(([, v]) => v > 0)
      .map(([catId, v]) => ({
        categoryId: Number(catId),
        limitCents: Math.round(Number(v) * 100)
      }))
    await setBudgets(list)
    onSaved()
  }

  if (recommendationLoading) return null

  return (
    <VStack align="stretch" gap={4} w="100%">
      {recommendationError && (
        <Text fontSize="sm" color="orange.500">
          {recommendationError}
        </Text>
      )}

      <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
        Valores sugeridos com base nos últimos 3 ciclos de fatura. Edite e salve para definir seus orçamentos.
      </Text>

      <VStack align="stretch" gap={3}>
        {categories.map(({ id, name }) => (
          <Box key={id} display="flex" alignItems="flex-start" gap={3} flexWrap="wrap">
            <Box flex="1 1 200px" minW={0}>
              <Input
                label={name}
                type="number"
                step={0.01}
                min={0}
                placeholder="0,00"
                value={limitsByCategory[id] != null && limitsByCategory[id] > 0 ? limitsByCategory[id] : ''}
                onChange={e => handleChange(id, e.target.value)}
                width="100%"
                minW="120px"
              />
            </Box>
            <Text fontSize="sm" color="gray.500" whiteSpace="nowrap" pt="8px">
              R$
            </Text>
          </Box>
        ))}
      </VStack>

      <Box display="flex" gap={3} pt={2}>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          loading={isSaving}
          colorPalette="orange"
        >
          {isSaving ? 'Salvando…' : 'Salvar orçamentos'}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </Box>
    </VStack>
  )
}
