import { Button, HStack } from '@/common/ui'
import { MonthSelector } from '@/Transactions/common/ui'
import { usePanelFiltersStore } from '@/Transactions/stores'
import { useSearchParams } from 'react-router-dom'
import { buildPanelFilterParams } from '@/Transactions/common/hooks'
import { FiEdit3 } from 'react-icons/fi'

type BudgetHeaderActionsProps = {
  onEditClick: () => void
}

export const BudgetHeaderActions = ({ onEditClick }: BudgetHeaderActionsProps) => {
  const [, setSearchParams] = useSearchParams()
  const { selectedDate, setSelectedDate } = usePanelFiltersStore()

  return (
    <HStack gap={2} flexShrink={0}>
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
      <Button
        size="sm"
        colorPalette="purple"
        onClick={onEditClick}
      >
        Editar
        <FiEdit3 />
      </Button>
    </HStack>
  )
}
