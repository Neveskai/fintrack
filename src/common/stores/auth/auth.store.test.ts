const mockAuth = {}
const mockOnAuthStateChanged = jest.fn()
const mockSignOut = jest.fn()

jest.mock('@/common/services/Firebase', () => ({
  auth: mockAuth,
}))

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}))

import { useAuthStore, getCurrentUserId } from './auth.store'

describe('auth store', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, loading: true })
    mockOnAuthStateChanged.mockClear()
    mockSignOut.mockClear()
  })

  describe('useAuthStore', () => {
    it('has initial loading true and user null', () => {
      expect(useAuthStore.getState().loading).toBe(true)
      expect(useAuthStore.getState().user).toBeNull()
    })

    it('onAuthStateChanged returns unsubscribe function', () => {
      mockOnAuthStateChanged.mockImplementation((_auth: unknown, onUser: (u: unknown) => void) => {
        onUser(null)
        return () => {}
      })
      const unsubscribe = useAuthStore.getState().onAuthStateChanged()
      expect(mockOnAuthStateChanged).toHaveBeenCalledWith(mockAuth, expect.any(Function), expect.any(Function))
      expect(typeof unsubscribe).toBe('function')
      unsubscribe()
    })

    it('signOut calls firebase signOut', async () => {
      mockSignOut.mockResolvedValue(undefined)
      await useAuthStore.getState().signOut()
      expect(mockSignOut).toHaveBeenCalledWith(mockAuth)
    })
  })

  describe('getCurrentUserId', () => {
    it('throws when user is null', () => {
      useAuthStore.setState({ user: null })
      expect(() => getCurrentUserId()).toThrow('[FinTrack] Usuário não autenticado.')
    })

    it('returns uid when user is set', () => {
      useAuthStore.setState({ user: { uid: 'user-123' } as import('firebase/auth').User })
      expect(getCurrentUserId()).toBe('user-123')
    })
  })
})
