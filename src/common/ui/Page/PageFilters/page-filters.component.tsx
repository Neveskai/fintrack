import { Box, type StackProps } from '@/common/ui'
import type { ReactNode } from 'react'

type PageFiltersProps = StackProps & {
  children: ReactNode
}

export const PageFilters = ({ children, ...props }: PageFiltersProps) => {
  return (
    <Box {...props} w="100%" h="fit-content">
      {children}
    </Box>
  )
}
