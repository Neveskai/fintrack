import React from 'react'
import {
  Textarea as ChakraTextarea,
  Field,
  HStack,
  Text,
  type TextareaProps
} from '@chakra-ui/react'
import { useTheme } from 'next-themes'
import { Tooltip } from '../Tooltip'
import { LuInfo } from 'react-icons/lu'

type DSTextareaProps = TextareaProps & {
  label?: string
  error?: string
  helpText?: string
  hintText: string
}

export const TextArea: React.FC<DSTextareaProps> = ({
  label,
  error,
  required,
  helpText,
  hintText,
  ...props
}) => {
  const { resolvedTheme } = useTheme()

  const redColor = resolvedTheme === 'light' ? 'red.400' : 'red.600'
  const placeholderColor = resolvedTheme === 'light' ? 'gray.400' : 'gray.500'

  return (
    <Field.Root required>
      {label && (
        <HStack ml={1} mb={-0.5} gap={1} align="center">
          <Field.Label fontSize="13.5px">
            {label}
            {required && (
              <Text color={redColor} ml={-0.5} fontSize={12}>
                *
              </Text>
            )}
          </Field.Label>

          {helpText && (
            <Tooltip content={helpText} openDelay={100} closeDelay={200}>
              <LuInfo size={14} style={{ marginLeft: '2px' }} />
            </Tooltip>
          )}
        </HStack>
      )}

      <ChakraTextarea
        {...props}
        bg="Background"
        _placeholder={{ color: placeholderColor }}
      />

      {hintText && <Field.HelperText ml={1}>{hintText}</Field.HelperText>}
      <Field.ErrorText mr={1} mt={0.5} position="absolute" top={0} right={0}>
        {error}
      </Field.ErrorText>
    </Field.Root>
  )
}
