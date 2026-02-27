/** Dado compartilhado entre gráfico de barras (desktop) e donut (mobile). */
export interface SegmentChartDatum {
  name: string
  value: number
  color: string
  id?: number
}

export interface SegmentChartAdapterProps {
  /** Dataset único usado em bar (desktop) e donut (mobile). */
  data: SegmentChartDatum[]
  /** Ordenação aplicada ao dataset (ex.: value desc). */
  sort?: { by: keyof SegmentChartDatum; direction: 'asc' | 'desc' }
  /** Cor do texto das labels (bar desktop). */
  labelColor?: string
  /** Callback ao clicar em um segmento (índice e item; ex.: navegar por categoria). */
  onSegmentClick?: (item: SegmentChartDatum, index: number) => void
  /** ClassNames para o bar (desktop) – ex.: category-bar-content, category-bar-label. */
  barContentClassName?: string
  barLabelClassName?: string
  barValueClassName?: string
  barFillsClassName?: string
  /** Ref para tooltip de label (apenas categoria, desktop). */
  labelTooltipRef?: React.RefObject<HTMLDivElement | null>
  /** Chave estável para forçar re-render do valor (ex.: chartKey). */
  chartKey?: string
  /** Chamado quando o gráfico de barras (desktop) é montado no DOM. */
  onDesktopChartMount?: () => void
}
