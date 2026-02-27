import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from './routes.tsx'

import { ThemeProvider } from 'next-themes'
import { DSProvider } from '@/common/ui/provider.tsx'
import { QueryClient, QueryClientProvider, onlineManager } from '@tanstack/react-query'
import { validateEnv } from '@/common/utils/env-validation'

import "react-datepicker/dist/react-datepicker.css";

;(globalThis as unknown as { __VITE_ENV__?: Record<string, unknown> }).__VITE_ENV__ = import.meta.env
validateEnv();

onlineManager.setOnline(navigator.onLine)
window.addEventListener('online', () => onlineManager.setOnline(true))
window.addEventListener('offline', () => onlineManager.setOnline(false))

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      retry: (failureCount, error) => {
        if (!navigator.onLine) return false
        return failureCount < 3 && !(error instanceof TypeError)
      }
    },
    mutations: {
      networkMode: 'offlineFirst'
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system">
      <DSProvider>
        <QueryClientProvider client={queryClient}>
          <AppRouter />
        </QueryClientProvider>
      </DSProvider>
    </ThemeProvider>
  </StrictMode>
)
