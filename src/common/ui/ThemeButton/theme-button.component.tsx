import { IconButton } from '@chakra-ui/react'
import { useTheme } from 'next-themes'
import { LuSun, LuMoon } from 'react-icons/lu'
import { useEffect, useState } from 'react'

export function ThemeButton() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const toggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <IconButton aria-label="Trocar tema" onClick={toggle} variant="subtle">
      {resolvedTheme === 'light' ? <LuSun /> : <LuMoon />}
    </IconButton>
  )
}
