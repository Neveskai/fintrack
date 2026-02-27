import { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/common/services/Firebase'
import { Button, Heading, Text } from '@/common/ui'

export const LoginPage = () => {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      const message = (err as { message?: string }).message
      console.error('Login error:', message ?? err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div
        className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl shadow-black/5 border border-zinc-100 text-center"
      >
        <img src="/logo.svg" alt="FinTrack" width={64} height={64} className="mx-auto mb-6" />

        <Heading className="text-3xl font-bold mb-2">FinTrack</Heading>
        <Text className="text-zinc-500 mb-8">Gerencie suas finanças com inteligência e rapidez.</Text>

        <Button onClick={handleLogin} disabled={loading}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            height={20}
            width={20}
            alt="Google"
          />
          {loading ? 'Entrando...' : 'Entrar com Google'}
        </Button>
      </div>
    </div>
  )
}
