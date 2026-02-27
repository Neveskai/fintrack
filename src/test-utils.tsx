import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DSProvider } from '@/common/ui/provider'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

interface AllTheProvidersProps {
  children: ReactNode
  queryClient?: QueryClient
}

function AllTheProviders({ children, queryClient }: AllTheProvidersProps) {
  const client = queryClient ?? createTestQueryClient()
  return (
    <DSProvider>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </DSProvider>
  )
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  const { queryClient, ...renderOptions } = options ?? {}
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders queryClient={queryClient}>{children}</AllTheProviders>
    ),
    ...renderOptions,
  })
}

export * from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'
export { customRender as render }
