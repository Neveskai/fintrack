import { PieLabelRenderProps } from 'recharts'

type renderLabelProps = PieLabelRenderProps & { theme: 'light' | 'dark' }

export const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })

export const renderLabel = ({
  x,
  y,
  cx,
  name,
  value,
  getColor
}: renderLabelProps) => {
  const textAnchor =
    typeof cx === 'number' ? (x! > cx! ? 'start' : 'end') : 'middle'

  const color = getColor(name as string)

  return (
    <text
      x={x}
      y={y}
      fill={color}
      textAnchor={textAnchor}
      dominantBaseline="central"
      style={{ fontSize: '13px', fontWeight: 600, userSelect: 'none' }}
    >
      {formatCurrency(value as number)}
    </text>
  )
}
