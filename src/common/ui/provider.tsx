import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react'
import type { ReactNode } from 'react'


const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: {
            value: { _light: "#f8f8f8", _dark: "#232323" },
          },
        }
      }
    },
  },
})

export const system = createSystem(defaultConfig, config)

export function DSProvider({ children }: { children: ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>
}
