import { PropsWithChildren, ReactElement } from 'react'
import type { PageHeader } from './PageHeader'
import type { PageFilters } from './PageFilters'
import type { PageBody } from './PageBody'
import { StackProps } from '@chakra-ui/react'

export type PageWithFilters = [
  ReactElement<typeof PageHeader>,
  ReactElement<typeof PageFilters>,
  ReactElement<typeof PageBody>
]

export type PageDefault = [
  ReactElement<typeof PageHeader>,
  ReactElement<typeof PageBody>
]

export type PageRootProps = StackProps & PropsWithChildren<{
  children: PageDefault | PageWithFilters
  isLoading?: boolean
  isError?: boolean
  onErrorRetry?: () => void
}>
