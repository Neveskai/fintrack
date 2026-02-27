import { useEffect, useState } from 'react'

/**
 * Returns true after `delayMs` of continuous loading.
 * Use to show an empty/fallback state instead of a spinner when loading takes too long.
 */
export function useLoadingTimeout(isLoading: boolean, delayMs: number): boolean {
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setTimedOut(false)
      return
    }
    const id = setTimeout(() => setTimedOut(true), delayMs)
    return () => clearTimeout(id)
  }, [isLoading, delayMs])

  return isLoading && timedOut
}
