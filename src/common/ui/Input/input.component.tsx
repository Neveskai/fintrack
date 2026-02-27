import React, { type ReactNode } from 'react'

import {
  HStack,
  Input as ChakraInput,
  Field,
  type InputProps,
  Text
} from '@chakra-ui/react'

import { useTheme } from 'next-themes'
import { Tooltip } from '../Tooltip'
import { LuInfo } from 'react-icons/lu'

type DSInputProps = InputProps & {
  label?: string
  helpText?: ReactNode
  hintText?: string
  error?: string
  fieldProps?: object
}

export const Input: React.FC<DSInputProps> = ({
  label,
  error,
  required,
  hintText,
  helpText,
  fieldProps,
  ...props
}) => {
  const { resolvedTheme } = useTheme()
  const placeholderColor = resolvedTheme === 'light' ? 'gray.400' : 'gray.500'

  return (
    <Field.Root invalid={!!error} disabled={props.disabled} {...fieldProps}>
      {label && (
        <HStack ml={1} mb={-0.5} gap={1} align="center">
          <Field.Label fontSize="13.5px">
            {label}
            {required && (
              <Text color="red.500" ml={-0.5}>
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

      <ChakraInput
        {...props}
        bg="Background"
        color={props.disabled ? placeholderColor : undefined}
        _placeholder={{ color: placeholderColor }}
      />

      {hintText && <Field.HelperText ml={1}>{hintText}</Field.HelperText>}
      <Field.ErrorText mr={1} mt={0.5} position="absolute" top={0} right={0}>
        {error}
      </Field.ErrorText>
    </Field.Root>
  )
}
