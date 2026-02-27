import { VStack } from '@/common/ui'
import { PageHeader } from './PageHeader'
import { PageBody } from './PageBody'
import { PageContext } from './PageContext'
import { PageFilters } from './PageFilters'
import { PageRootProps } from './page.types'

const PageRoot = ({
  children,
  isLoading,
  isError,
  onErrorRetry,
  ...props
}: PageRootProps) => {
  return (
    <PageContext.Provider value={{ isLoading, isError, onErrorRetry }}>
      <VStack
        m="auto"
        w="100%"
        align="stretch"
        py={4}
        px={{ base: 3, sm: 5, md: 8, lg: 10, xl: 12 }}
        minHeight="calc(100vh - 60px)"
        maxWidth="1300px"
        {...props}
      >
        {children}
      </VStack>
    </PageContext.Provider>
  )
}

export const Page = {
  Root: PageRoot,
  Body: PageBody,
  Filters: PageFilters,
  Header: PageHeader
}
