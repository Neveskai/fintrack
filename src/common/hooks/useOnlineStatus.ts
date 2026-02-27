import { useSyncExternalStore } from 'react'

const subscribe = (callback: () => void) => {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

const getSnapshot = () => navigator.onLine

export const useOnlineStatus = () => {
  return useSyncExternalStore(subscribe, getSnapshot)
}
