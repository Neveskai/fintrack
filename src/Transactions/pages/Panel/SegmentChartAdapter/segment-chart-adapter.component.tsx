import { Box, useBreakpointValue, HStack, Text, Stack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useChart, BarSegment, Chart } from '@chakra-ui/charts'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import type { SegmentChartAdapterProps, SegmentChartDatum } from './segment-chart-adapter.types'

type BarChartData = { name: string; value: number; color: string }

function DesktopBarChart({
  chart,
  chartKey,
  labelTooltipRef,
  labelColor,
  barContentClassName,
  barLabelClassName,
  barValueClassName,
  barFillsClassName,
  onMount
}: {
  chart: ReturnType<typeof useChart>
  chartKey?: string
  labelTooltipRef?: React.RefObject<HTMLDivElement | null>
  labelColor?: string
  barContentClassName?: string
  barLabelClassName?: string
  barValueClassName?: string
  barFillsClassName?: string
  onMount?: () => void
}) {
  useEffect(() => {
    onMount?.()
  }, [onMount])
  return (
    <>
      {labelTooltipRef && (
        <div ref={labelTooltipRef} className="category-bar-label-tooltip" aria-hidden />
      )}
      <BarSegment.Root chart={chart}>
        <BarSegment.Content className={barContentClassName}>
          <BarSegment.Label className={barLabelClassName} color={labelColor} gap={1} />
          <BarSegment.Value
            mt={-0.5}
            key={chartKey}
            className={barValueClassName}
            gap={1}
          />
          <BarSegment.Bar className={barFillsClassName} />
        </BarSegment.Content>
      </BarSegment.Root>
    </>
  )
}

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export const SegmentChartAdapter = ({
  data,
  sort = { by: 'value', direction: 'desc' },
  labelColor,
  onSegmentClick,
  barContentClassName,
  barLabelClassName,
  barValueClassName,
  barFillsClassName,
  labelTooltipRef,
  chartKey,
  onDesktopChartMount
}: SegmentChartAdapterProps) => {
  const isDesktop = useBreakpointValue({ base: false, md: true })
  const chart = useChart({
    sort,
    data: data as BarChartData[]
  })

  if (data.length === 0) {
    return (
      <Box py={4} textAlign="center" color="fg.muted" fontSize="sm">
        Nenhum dado para exibir
      </Box>
    )
  }

  if (isDesktop) {
    return (
      <DesktopBarChart
        chart={chart}
        chartKey={chartKey}
        labelTooltipRef={labelTooltipRef}
        labelColor={labelColor}
        barContentClassName={barContentClassName}
        barLabelClassName={barLabelClassName}
        barValueClassName={barValueClassName}
        barFillsClassName={barFillsClassName}
        onMount={onDesktopChartMount}
      />
    )
  }

  const segmentData = chart.data as SegmentChartDatum[]

  return (
    <Stack gap={3} w="100%">
      <Chart.Root chart={chart}>
        <PieChart>
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 12
            }}
            labelFormatter={(name) => name}
          />

          <Pie
            data={segmentData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="85%"
            paddingAngle={2}
            onClick={(_, index) => {
              const item = segmentData[index]
              if (item) onSegmentClick?.(item, index)
            }}
            style={{ cursor: onSegmentClick ? 'pointer' : 'default' }}
          >
            {segmentData.map((entry) => (
              <Cell key={entry.name} fill={chart.color(entry.color)} stroke={undefined} />
            ))}
          </Pie>
        </PieChart>
      </Chart.Root>

      <Stack gap={1.5} pl={1}>
        {segmentData.map((entry) => (
          <HStack key={entry.name} gap={2} justifyContent="space-between" fontSize="sm">
            <HStack gap={2} minW={0}>
              <Box
                w="3"
                h="3"
                borderRadius="full"
                bg={entry.color}
                flexShrink={0}
                title={entry.name}
              />

              <Text truncate color="fg" title={entry.name}>
                {entry.name}
              </Text>
            </HStack>

            <Text fontWeight="600" color="fg" whiteSpace="nowrap">
              {formatCurrency(entry.value)}
            </Text>
          </HStack>
        ))}
      </Stack>
    </Stack>
  )
}
