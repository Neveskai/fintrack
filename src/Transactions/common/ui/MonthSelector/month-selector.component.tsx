import { Button, HStack, IconButton } from '@/common/ui'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

type MonthSelectorProps = {
  value: Date | null
  onChange: (date: Date) => void
}

export const MonthSelector = ({ value, onChange }: MonthSelectorProps) => {
  const date = value ?? new Date()

  const goPrev = () => {
    const d = new Date(date.getFullYear(), date.getMonth() - 1, 1)
    onChange(d)
  }

  const goNext = () => {
    const d = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    onChange(d)
  }

  const goToCurrentMonth = () => {
    onChange(new Date())
  }

  const isCurrentMonth = () => {
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }

  return (
    <HStack gap={2} flexShrink={0}>
      <IconButton
        aria-label="Mês anterior"
        size="sm"
        variant="outline"
        onClick={goPrev}
      >
        <FiChevronLeft />
      </IconButton>
      <Button
        size="sm"
        variant="outline"
        colorPalette="gray"
        onClick={goToCurrentMonth}
        disabled={isCurrentMonth()}
      >
        Mês Atual
      </Button>
      <IconButton
        aria-label="Próximo mês"
        size="sm"
        variant="outline"
        onClick={goNext}
      >
        <FiChevronRight />
      </IconButton>
    </HStack>
  )
}
