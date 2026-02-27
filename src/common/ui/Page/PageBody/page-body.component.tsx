import { Center, Spinner, VStack, type StackProps } from '@/common/ui'
import type { ReactNode } from 'react'
import { usePageContext } from '../PageContext'
import { ErrorState } from '@/common/ui/ErrorState'

type PageBodyProps = StackProps & {
  children: ReactNode
}

export const PageBody = ({ children, ...props }: PageBodyProps) => {
  const { isLoading, isError, onErrorRetry } = usePageContext()

  if (isLoading)
    return (
      <Center py={20} minHeight="300px" w="100%">
        <Spinner size="xl" m="auto" />
      </Center>
    )

  if (isError) return <ErrorState onRetry={onErrorRetry} />

  return (
    <VStack {...props} w="100%" align="stretch">
      {children}
    </VStack>
  )
}
