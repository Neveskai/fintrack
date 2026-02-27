import React from 'react'
import {
  Switch as ChakraSwitch,
  Field,
  HStack,
  type SwitchRootProps
} from '@chakra-ui/react'
import { Tooltip } from '../Tooltip'
import { LuInfo } from 'react-icons/lu'

import './switch.styles.css'

type DSSwitchProps = SwitchRootProps & {
  label?: string
  error?: string
  helpText?: string
  hintText?: string
}

export const Switch: React.FC<DSSwitchProps> = ({
  label,
  error,
  helpText,
  hintText,
  ...props
}) => {
  return (
    <Field.Root>
      {label && (
        <HStack ml={1} mb={-1} gap={1} align="center">
          <Field.Label fontSize="13.5px">{label}</Field.Label>

          {helpText && (
            <Tooltip content={helpText} openDelay={100} closeDelay={200}>
              <LuInfo size={14} style={{ marginLeft: '2px' }} />
            </Tooltip>
          )}
        </HStack>
      )}

      <ChakraSwitch.Root {...props} height="40px" size="lg" ml={1}>
        <ChakraSwitch.HiddenInput />
        <ChakraSwitch.Control>
          <ChakraSwitch.Thumb />
        </ChakraSwitch.Control>
      </ChakraSwitch.Root>

      {hintText && <Field.HelperText ml={1}>{hintText}</Field.HelperText>}
      <Field.ErrorText ml={1}>{error}</Field.ErrorText>
    </Field.Root>
  )
}
