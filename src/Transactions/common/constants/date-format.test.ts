import { formatMonthYear } from './date-format'

describe('formatMonthYear', () => {
  it('formats January 2025', () => {
    expect(formatMonthYear(new Date(2025, 0, 15))).toBe('Janeiro de 2025')
  })

  it('formats December 2024', () => {
    expect(formatMonthYear(new Date(2024, 11, 1))).toBe('Dezembro de 2024')
  })

  it('formats all months correctly', () => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    months.forEach((name, index) => {
      expect(formatMonthYear(new Date(2025, index, 1))).toBe(`${name} de 2025`)
    })
  })
})
