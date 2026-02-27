import { create } from 'zustand'
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from 'firebase/auth'
import { auth } from '@/common/services/Firebase'

interface AuthState {
  user: User | null
  loading: boolean
  onAuthStateChanged: () => () => void
  signOut: () => Promise<void>
}

export function getCurrentUserId(): string {
  const uid = useAuthStore.getState().user?.uid
  if (!uid) throw new Error('[FinTrack] Usuário não autenticado.')
  return uid
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  onAuthStateChanged: () => {
    const timeout = setTimeout(() => set({ loading: false }), 2000)

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeout)
      set({ user, loading: false })
    }, (error) => {
      clearTimeout(timeout)
      console.error('Auth state change error:', error)
      set({ loading: false })
    })

    return unsubscribe
  },
  signOut: async () => {
    await firebaseSignOut(auth)
  },
}))
