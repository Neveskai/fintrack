import { Box, Button, Text, VStack } from '@/common/ui'
import { ErrorStateIllustration } from './error-state-illustration'

export type ErrorStateProps = {
  title?: string
  description?: string
  onRetry?: () => void
  illustrationSize?: number
}

export const ErrorState = ({
  title = 'Algo deu errado',
  description = 'Não foi possível carregar. Tente novamente.',
  onRetry,
  illustrationSize = 160
}: ErrorStateProps) => (
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
      <ErrorStateIllustration size={illustrationSize} />
    </Box>
    <VStack gap={1} textAlign="center" maxW="360px">
      <Text fontSize="lg" fontWeight="semibold" color="fg">
        {title}
      </Text>
      <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }}>
        {description}
      </Text>
    </VStack>
    {onRetry && (
      <Button colorPalette="blue" variant="outline" onClick={onRetry}>
        Tentar novamente
      </Button>
    )}
  </VStack>
)
