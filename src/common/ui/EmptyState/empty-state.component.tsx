import { Box, Text, VStack } from '@/common/ui'
import type { ReactNode } from 'react'
import { EmptyStateIllustration } from './empty-state-illustration'

export type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
  illustrationSize?: number
}

export const EmptyState = ({
  title,
  description,
  action,
  illustrationSize = 160
}: EmptyStateProps) => (
  <VStack
    py={12}
    px={4}
    gap={6}
    align="center"
    justify="center"
    minH="320px"
    w="100%"
    color="fg"
  >
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ '& svg': { color: 'inherit' } }}
      _dark={{ color: 'gray.300' }}
    >
      <EmptyStateIllustration size={illustrationSize} />
    </Box>
    <VStack gap={1} textAlign="center" maxW="360px">
      <Text fontSize="lg" fontWeight="semibold" color="fg">
        {title}
      </Text>
      {description && (
        <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }}>
          {description}
        </Text>
      )}
    </VStack>
    {action && <Box mt={2}>{action}</Box>}
  </VStack>
)
