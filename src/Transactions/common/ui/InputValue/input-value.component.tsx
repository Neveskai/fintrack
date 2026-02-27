import { Input } from '@/common/ui'
import { useCallback } from 'react'

type Props = {
  value: string
  label?: string
  onChange: (value: string) => void
}

export const InputValue = ({ value, label = "Valor", onChange }: Props) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '')
      const asNumber = parseInt(raw || '0', 10)
      const formatted = (asNumber / 100).toFixed(2)

      onChange(formatted)
    },
    [onChange]
  )

  const formatDisplayValue = useCallback(() => {
    const parsedValue = parseFloat(value || '0')

    return parsedValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }, [value])

  return (
    <Input
      w="100%"
      inputMode="numeric"
      pattern="[0-9]*"
      label={label}
      placeholder="Digite um Valor"
      value={formatDisplayValue()}
      onChange={handleChange}
    />
  )
}
