const MONTH_NAMES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
] as const

/** Formata uma data como "Janeiro de 2025" para uso em títulos. */
export function formatMonthYear(date: Date): string {
  return `${MONTH_NAMES_PT[date.getMonth()]} de ${date.getFullYear()}`
}
