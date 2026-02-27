import React from 'react'
import { Text as ChakraText, type TextProps } from '@chakra-ui/react'

export const Text: React.FC<TextProps> = ({ children, ...props }) => {
  return (
    <ChakraText width="100%" {...props}>
      {children}
    </ChakraText>
  )
}
