import { Box, Breadcrumb, Heading, Text, type BoxProps } from '@/common/ui'
import type { ReactNode } from 'react'

type PageHeaderProps = BoxProps & {
  breadcrumb: { label: string; href?: string }[]
  title: string
  description?: ReactNode
  action?: ReactNode
}

export const PageHeader = ({
  breadcrumb,
  title,
  description,
  action,
  ...boxProps
}: PageHeaderProps) => {
  return (
    <Box
      pl={0.5}
      pt={4}
      pb={5}
      gap={2.5}
      display="flex"
      flexDirection="column"
      minW={0}
      {...boxProps}
    >
      <Breadcrumb routes={breadcrumb} pl='3px' />

      <Box
        display="flex"
        flexDirection={{ base: 'column', sm: 'row' }}
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems={{ base: 'flex-start', sm: 'center' }}
        gap={3}
        minW={0}
      >
        <Heading as="h1" fontSize="3xl" minW={0}>
          {title}
        </Heading>
        {action}
      </Box>

      {description != null && (
        <Box minW={0}>
          {typeof description === 'string' ? (
            <Text ml={0.5}>{description}</Text>
          ) : (
            description
          )}
        </Box>
      )}
    </Box>
  )
}
