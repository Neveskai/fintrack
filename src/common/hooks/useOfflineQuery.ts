import { useQuery, UseQueryOptions, QueryKey, QueryFunctionContext } from '@tanstack/react-query'
import { OfflineCache } from '@/common/services/offline-cache'
import { useOnlineStatus } from './useOnlineStatus'
import { useEffect } from 'react'

type OriginalQueryFn<TData> = (ctx: QueryFunctionContext) => Promise<TData>

export function useOfflineQuery<TData>(
  options: UseQueryOptions<TData> & { queryKey: QueryKey }
) {
  const isOnline = useOnlineStatus()
  const cacheKey = JSON.stringify(options.queryKey)
  const originalQueryFn = options.queryFn as OriginalQueryFn<TData>

  const result = useQuery<TData>({
    ...options,
    queryFn: async (ctx: QueryFunctionContext) => {
      if (!isOnline) {
        const cached = await OfflineCache.get<TData>(cacheKey)
        if (cached) return cached
        throw new Error('Sem conexão e sem dados em cache')
      }

      const data = await originalQueryFn(ctx)
      await OfflineCache.set(cacheKey, data)
      return data
    },
    retry: isOnline ? 3 : 0,
    staleTime: isOnline ? (options.staleTime ?? 0) : Infinity
  })

  useEffect(() => {
    if (result.data && isOnline) {
      OfflineCache.set(cacheKey, result.data)
    }
  }, [result.data, isOnline, cacheKey])

  return result
}
