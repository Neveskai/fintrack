import { Box, Heading } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { Transaction } from '@/Transactions/domain/Transaction'
import { getCategoryChartColor } from '@/Transactions/common/constants/colors'
import { TransactionRoutes } from '@/Transactions/transactions.routes'
import { useListFiltersStore } from '@/Transactions/stores'
import { buildListFilterParams } from '@/Transactions/common/hooks'
import { SegmentChartAdapter } from '../SegmentChartAdapter'
import type { SegmentChartDatum } from '../SegmentChartAdapter'

import './sum-by-category.styles.css'
import { useCallback, useEffect, useRef, useState } from 'react'

type CategoryData = SegmentChartDatum & { id: number }

interface SumByCategoryProps {
  transactions: Transaction[]
  bgColor: string
  headingColor: string
  labelColor: string
}

export const SumByCategory = ({
  transactions,
  bgColor,
  headingColor,
  labelColor
}: SumByCategoryProps) => {
  const categoryMap: Record<string, CategoryData> = {}
  const chartKey = transactions.map(t => t.id).join('|')
  const expenses = transactions.filter(t => t.isExpense)

  expenses.forEach(t => {
    const { id, name } = t.category!

    if (!categoryMap[name]) {
      categoryMap[name] = {
        id,
        name,
        value: t.amount,
        color: getCategoryChartColor(id)
      }
    } else {
      categoryMap[name].value += t.amount
    }
  })

  const navigate = useNavigate()
  const listFilters = useListFiltersStore()
  const listFiltersRef = useRef(listFilters)
  const categoryList = Object.values(categoryMap)

  listFiltersRef.current = listFilters
  const labelTooltipRef = useRef<HTMLDivElement>(null)
  const sortedCategoryData = [...categoryList].sort((a, b) => b.value - a.value)
  const chartDataRef = useRef<CategoryData[]>(sortedCategoryData)

  chartDataRef.current = sortedCategoryData

  const [desktopChartMounted, setDesktopChartMounted] = useState(0)

  const handleSegmentClick = (item: SegmentChartDatum) => {
    if (item.id == null) return

    const params = buildListFilterParams({
      ...listFiltersRef.current,
      category: String(item.id)
    })

    navigate(`${TransactionRoutes.Transactions}?${params.toString()}`)
  }

  const onDesktopChartMount = useCallback(() => {
    setDesktopChartMounted((m) => m + 1)
  }, [])

  useEffect(() => {
    const data = chartDataRef.current
    const bars = document.querySelectorAll('.category-bar-fills > div')
    const valueDivs = document.querySelectorAll('.category-bar-values > div')

    valueDivs.forEach((div, index) => {
      const item = data[index]

      if (item) div.textContent = item.value.toFixed(0)
    })

    bars.forEach(fill => {
      const bar = fill as HTMLElement
      const percent = getComputedStyle(bar).getPropertyValue('--bar-percent')

      bar.textContent = Number(percent.trim().replace('%', '')).toFixed(0) + '%'
    })
  }, [transactions, desktopChartMounted])

  useEffect(() => {
    const barElements = document.querySelectorAll('.category-bar-fills > div')
    const data = chartDataRef.current
    const handlers: (() => void)[] = []

    const handleBarClick = (index: number) => {
      const item = data[index]

      if (!item || item.id == null) return

      const params = buildListFilterParams({
        ...listFiltersRef.current,
        category: String(item.id)
      })

      navigate(`${TransactionRoutes.Transactions}?${params.toString()}`)
    }

    barElements.forEach((el, index) => {
      const handler = () => handleBarClick(index)

      handlers.push(handler)

      el.addEventListener('click', handler)
    })

    return () => {
      barElements.forEach((el, index) => {
        el.removeEventListener('click', handlers[index])
      })
    }
  }, [transactions, navigate, desktopChartMounted])

  useEffect(() => {
    const tooltipEl = labelTooltipRef.current
    if (!tooltipEl) return

    const labelRow = document.querySelector('.category-bar-label')
    if (!labelRow) return

    const cells = labelRow.querySelectorAll(':scope > *')
    
    const showTooltip = (e: Event) => {
      const target = e.currentTarget as HTMLElement
      const text = target.textContent?.trim()

      if (!text) return

      const rect = target.getBoundingClientRect()
      tooltipEl.textContent = text
      tooltipEl.style.left = `${rect.left + rect.width / 2}px`
      tooltipEl.style.top = `${rect.top - 4}px`
      tooltipEl.style.transform = 'translate(-50%, -100%)'
      tooltipEl.style.display = 'block'
    }
    
    const hideTooltip = () => {
      tooltipEl.style.display = 'none'
    }

    cells.forEach((el) => {
      el.addEventListener('mouseenter', showTooltip)
      el.addEventListener('mouseout', hideTooltip)
    })

    return () => {
      cells.forEach((el) => {
        el.removeEventListener('mouseenter', showTooltip)
        el.removeEventListener('mouseout', hideTooltip)
      })
    }
  }, [transactions, desktopChartMounted])

  return (
    <Box
      bg={bgColor}
      p={{ base: 3, md: 4 }}
      borderRadius="xs"
      shadow="xs"
      position="relative"
      w="100%"
      minW={0}
      overflow="hidden"
    >
      <Heading size="md" mb={1} color={headingColor}>
        Gráfico por Categorias
      </Heading>

      <SegmentChartAdapter
        data={categoryList}
        sort={{ by: 'value', direction: 'desc' }}
        labelColor={labelColor}
        onSegmentClick={handleSegmentClick}
        barContentClassName="category-bar-content"
        barLabelClassName="category-bar-label"
        barValueClassName="category-bar-values"
        barFillsClassName="category-bar-fills"
        labelTooltipRef={labelTooltipRef}
        chartKey={chartKey}
        onDesktopChartMount={onDesktopChartMount}
      />
    </Box>
  )
}
