// PageContext.tsx
import { createContext, useContext } from 'react'

type PageContextType = {
  isLoading?: boolean
  isError?: boolean
  onErrorRetry?: () => void
}

export const PageContext = createContext<PageContextType>({})

export const usePageContext = () => useContext(PageContext)
