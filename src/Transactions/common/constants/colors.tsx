import {
  Category,
  TransactionType,
  TransactionTypeEnum
} from '@/Transactions/common/enums'
import { JSX } from 'react'
import {
  FiArrowDown,
  FiArrowUp,
  FiShoppingCart,
  FiTruck,
  FiHome,
  FiBook,
  FiActivity,
  FiRepeat,
  FiDollarSign,
  FiTrendingUp,
  FiShoppingBag,
  FiFilm,
  FiMoreHorizontal,
  FiCreditCard
} from 'react-icons/fi'
import type { IconType } from 'react-icons'

const DEFAULT_CATEGORY_COLOR = 'gray.500'
const DEFAULT_CATEGORY_TEXT_LIGHT = 'gray.600'
const DEFAULT_CATEGORY_TEXT_DARK = 'gray.500'
const DEFAULT_CATEGORY_BG_LIGHT = 'gray.100'
const DEFAULT_CATEGORY_BG_DARK = 'gray.800'

/* Category Colors (system ids 1–11; custom ids use default) */
const lightCategoryTextColors: Record<number, string> = {
  [Category.ALIMENTACAO]: 'orange.700',
  [Category.TRANSPORTE]: 'blue.700',
  [Category.MORADIA]: 'yellow.700',
  [Category.EDUCACAO]: 'purple.700',
  [Category.SAUDE]: 'red.700',
  [Category.ASSINATURAS]: 'cyan.700',
  [Category.TRANSFERENCIA]: 'gray.700',
  [Category.INVESTIMENTO]: 'green.700',
  [Category.COMPRAS]: 'pink.700',
  [Category.LAZER]: 'teal.700',
  [Category.OUTROS]: 'gray.600'
}

const lightCategoryBgColors: Record<number, string> = {
  [Category.ALIMENTACAO]: 'orange.100',
  [Category.TRANSPORTE]: 'blue.100',
  [Category.MORADIA]: 'yellow.100',
  [Category.EDUCACAO]: 'purple.100',
  [Category.SAUDE]: 'red.100',
  [Category.ASSINATURAS]: 'cyan.100',
  [Category.TRANSFERENCIA]: 'gray.100',
  [Category.INVESTIMENTO]: 'green.100',
  [Category.COMPRAS]: 'pink.100',
  [Category.LAZER]: 'teal.100',
  [Category.OUTROS]: 'gray.100'
}

const darkCategoryTextColors: Record<number, string> = {
  [Category.ALIMENTACAO]: 'orange.400',
  [Category.TRANSPORTE]: 'blue.400',
  [Category.MORADIA]: 'yellow.500',
  [Category.EDUCACAO]: 'purple.400',
  [Category.SAUDE]: 'red.400',
  [Category.ASSINATURAS]: 'cyan.400',
  [Category.TRANSFERENCIA]: 'gray.400',
  [Category.INVESTIMENTO]: 'green.400',
  [Category.COMPRAS]: 'pink.400',
  [Category.LAZER]: 'teal.400',
  [Category.OUTROS]: 'gray.500'
}

const darkCategoryBgColors: Record<number, string> = {
  [Category.ALIMENTACAO]: 'orange.900',
  [Category.TRANSPORTE]: 'blue.900',
  [Category.MORADIA]: 'yellow.900',
  [Category.EDUCACAO]: 'purple.900',
  [Category.SAUDE]: 'red.900',
  [Category.ASSINATURAS]: 'cyan.900',
  [Category.TRANSFERENCIA]: 'gray.800',
  [Category.INVESTIMENTO]: 'green.900',
  [Category.COMPRAS]: 'pink.900',
  [Category.LAZER]: 'teal.900',
  [Category.OUTROS]: 'gray.800'
}

export const categoryChartColorMap: Record<number, string> = {
  [Category.ALIMENTACAO]: 'orange.500',
  [Category.TRANSPORTE]: 'blue.600',
  [Category.MORADIA]: 'yellow.500',
  [Category.EDUCACAO]: 'purple.600',
  [Category.SAUDE]: 'red.500',
  [Category.ASSINATURAS]: 'cyan.600',
  [Category.TRANSFERENCIA]: 'gray.500',
  [Category.INVESTIMENTO]: 'green.600',
  [Category.COMPRAS]: 'pink.500',
  [Category.LAZER]: 'teal.500',
  [Category.OUTROS]: 'gray.400'
}

export function getCategoryChartColor(id: number): string {
  return categoryChartColorMap[id] ?? DEFAULT_CATEGORY_COLOR
}

/** Icons for budget/category cards (system categories 1–11; custom use FiMoreHorizontal). */
export const categoryIconMap: Record<number, IconType> = {
  [Category.ALIMENTACAO]: FiShoppingCart,
  [Category.TRANSPORTE]: FiTruck,
  [Category.MORADIA]: FiHome,
  [Category.EDUCACAO]: FiBook,
  [Category.SAUDE]: FiActivity,
  [Category.ASSINATURAS]: FiRepeat,
  [Category.TRANSFERENCIA]: FiDollarSign,
  [Category.INVESTIMENTO]: FiTrendingUp,
  [Category.COMPRAS]: FiShoppingBag,
  [Category.LAZER]: FiFilm,
  [Category.OUTROS]: FiMoreHorizontal
}

export function getCategoryIcon(categoryId: number): IconType {
  return categoryIconMap[categoryId] ?? FiMoreHorizontal
}

/**
 * Ícone por descrição/estabelecimento (palavras-chave na descrição).
 * Útil para listas de transações. Fallback: FiCreditCard.
 */
const descriptionIconRules: Array<{ match: string | RegExp; icon: IconType }> = [
  { match: 'uber', icon: FiTruck },
  { match: '99 ', icon: FiTruck },
  { match: 'taxi', icon: FiTruck },
  { match: 'posto', icon: FiTruck },
  { match: 'gasolina', icon: FiTruck },
  { match: 'combustível', icon: FiTruck },
  { match: 'ipiranga', icon: FiTruck },
  { match: 'shell', icon: FiTruck },
  { match: 'br distribuidora', icon: FiTruck },
  { match: 'netflix', icon: FiFilm },
  { match: 'spotify', icon: FiFilm },
  { match: 'youtube', icon: FiFilm },
  { match: 'disney', icon: FiFilm },
  { match: 'mercado', icon: FiShoppingCart },
  { match: 'supermercado', icon: FiShoppingCart },
  { match: 'carrefour', icon: FiShoppingCart },
  { match: 'atacadão', icon: FiShoppingCart },
  { match: 'pao de acucar', icon: FiShoppingCart },
  { match: 'ifood', icon: FiShoppingCart },
  { match: 'rappi', icon: FiShoppingCart },
  { match: 'restaurante', icon: FiShoppingCart },
  { match: 'lanchonete', icon: FiShoppingCart },
  { match: 'farmácia', icon: FiActivity },
  { match: 'farmacia', icon: FiActivity },
  { match: 'drogaria', icon: FiActivity },
  { match: 'amazon', icon: FiShoppingBag },
  { match: 'magazine', icon: FiShoppingBag },
  { match: 'americanas', icon: FiShoppingBag },
  { match: 'luz', icon: FiHome },
  { match: 'eletricidade', icon: FiHome },
  { match: 'energia', icon: FiHome },
  { match: 'sabesp', icon: FiHome },
  { match: 'água', icon: FiHome },
  { match: 'agua', icon: FiHome },
  { match: 'gás', icon: FiHome },
  { match: 'gas ', icon: FiHome },
  { match: 'vivo', icon: FiRepeat },
  { match: 'claro', icon: FiRepeat },
  { match: 'oi ', icon: FiRepeat },
  { match: 'tim ', icon: FiRepeat },
  { match: 'telefone', icon: FiRepeat },
  { match: 'internet', icon: FiRepeat },
  { match: 'assinatura', icon: FiRepeat },
  { match: 'escola', icon: FiBook },
  { match: 'curso', icon: FiBook },
  { match: 'faculdade', icon: FiBook },
  { match: 'universidade', icon: FiBook },
  { match: 'investimento', icon: FiTrendingUp },
  { match: 'transferência', icon: FiDollarSign },
  { match: 'transferencia', icon: FiDollarSign },
  { match: 'ted', icon: FiDollarSign },
  { match: 'pix', icon: FiDollarSign },
  { match: 'doc', icon: FiDollarSign }
]

export function getDescriptionIcon(description: string | null | undefined): IconType {
  if (!description?.trim()) return FiCreditCard
  const lower = description.toLowerCase().trim()
  for (const { match, icon } of descriptionIconRules) {
    if (typeof match === 'string' ? lower.includes(match) : match.test(lower)) {
      return icon
    }
  }
  return FiCreditCard
}

export const useCategoryColors = (theme: string | undefined) => {
  const textMap = theme === 'light' ? lightCategoryTextColors : darkCategoryTextColors
  const bgMap = theme === 'light' ? lightCategoryBgColors : darkCategoryBgColors
  const defaultText = theme === 'light' ? DEFAULT_CATEGORY_TEXT_LIGHT : DEFAULT_CATEGORY_TEXT_DARK
  const defaultBg = theme === 'light' ? DEFAULT_CATEGORY_BG_LIGHT : DEFAULT_CATEGORY_BG_DARK

  const textColors: Record<number, string> = new Proxy(textMap, {
    get: (t, k) => (t[Number(k)] ?? defaultText) as string
  })
  const bgColors: Record<number, string> = new Proxy(bgMap, {
    get: (t, k) => (t[Number(k)] ?? defaultBg) as string
  })

  return { textColors, bgColors }
}

/* Transaction Type Colors */
const lightTypeColors: Record<TransactionTypeEnum, string> = {
  [TransactionType.INCOME]: 'green.600',
  [TransactionType.EXPENSE]: 'red.500'
}

const darkTypeColors: Record<TransactionTypeEnum, string> = {
  [TransactionType.INCOME]: 'green.500',
  [TransactionType.EXPENSE]: 'red.400'
}

export const useTypeColor = (theme: string | undefined) => {
  return theme === 'light' ? lightTypeColors : darkTypeColors
}

export const typeIconMap: Record<TransactionTypeEnum, () => JSX.Element> = {
  [TransactionType.INCOME]: () => (
    <FiArrowUp size={14} style={{ marginLeft: '-3px', width: '22px' }} />
  ),
  [TransactionType.EXPENSE]: () => (
    <FiArrowDown size={14} style={{ marginLeft: '-3px', width: '22px' }} />
  )
}

/** Paleta para gráfico por descrição/CNPJ (estabelecimento). */
export const descriptionChartColorPalette: string[] = [
  'blue.600',
  'purple.500',
  'orange.500',
  'teal.600',
  'pink.500',
  'cyan.600',
  'red.500',
  'green.600',
  'yellow.600',
  'gray.500'
]
