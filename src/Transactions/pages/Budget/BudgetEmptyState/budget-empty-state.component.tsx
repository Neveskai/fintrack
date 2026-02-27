import { Button, EmptyState, VStack } from '@/common/ui'
import { FiPlus, FiCopy } from 'react-icons/fi'
import { formatMonthYear } from '@/Transactions/common/constants'

type BudgetEmptyStateProps = {
  selectedDate: Date
  onCreateBudget: () => void
  onCopyFromNextMonth: () => void
}

export const BudgetEmptyState = ({
  selectedDate,
  onCreateBudget,
  onCopyFromNextMonth
}: BudgetEmptyStateProps) => {
  const monthLabel = formatMonthYear(selectedDate)

  return (
    <EmptyState
      title="Nenhum orçamento encontrado"
      description={`Crie seu primeiro orçamento para ${monthLabel}. Defina limites por categoria e acompanhe seus gastos.`}
      action={
        <VStack gap={3} w="100%" maxW="320px">
          <Button w="100%" colorPalette="orange" onClick={onCreateBudget}>
            <FiPlus />
            Criar Orçamento
          </Button>
          <Button
            w="100%"
            variant="outline"
            colorPalette="gray"
            onClick={onCopyFromNextMonth}
          >
            <FiCopy />
            Copiar Mês Seguinte
          </Button>
        </VStack>
      }
    />
  )
}
