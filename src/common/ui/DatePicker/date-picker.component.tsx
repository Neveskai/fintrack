import React from 'react'
import ReactDatePicker from 'react-datepicker'
import { ptBR, type Locale } from 'date-fns/locale'

import { useTheme } from 'next-themes'
import { Field, HStack, IconButton, Text } from '@chakra-ui/react'
import { Box, Input as ChakraInput } from '@chakra-ui/react'
import cn from 'classnames'

import './date-picker.styles.css'
import { Tooltip } from '../Tooltip'
import { LuInfo, LuX } from 'react-icons/lu'
import { format } from 'date-fns'

type DSDatePickerProps = {
  label?: string
  error?: string
  helpText?: string
  required?: boolean
  hintText?: string
  selected: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  mode?: 'day' | 'month' | 'year'
  locale?: Locale
  clearable?: boolean
}

export const DatePicker: React.FC<DSDatePickerProps> = ({
  label,
  error,
  clearable,
  hintText,
  helpText,
  selected,
  required,
  onChange,
  placeholder,
  mode = 'day',
  locale = ptBR
}) => {
  const { resolvedTheme } = useTheme()
  const placeholderColor = resolvedTheme === 'light' ? 'gray.400' : 'gray.500'

  const wrapperClass = cn(
    'react-datepicker-wrapper',
    'react-datepicker__input-container'
  )

  const themeClass = resolvedTheme === 'light' ? 'light-theme' : 'dark-theme'
  const redColor = resolvedTheme === 'light' ? 'red.400' : 'red.600'

  const formatDisplayValue = (date: Date | null) => {
    if (!date) return ''
    let raw = ''

    switch (mode) {
      case 'month':
        raw = format(date, 'MMM/yyyy', { locale })
        break
      case 'year':
        raw = format(date, 'yyyy', { locale })
        break
      default:
        raw = format(date, 'dd/MM/yyyy', { locale })
    }

    return raw.charAt(0).toUpperCase() + raw.slice(1)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomInput = React.forwardRef<HTMLInputElement, any>(
    ({ onClick }, ref) => (
      <ChakraInput
        ref={ref}
        onClick={onClick}
        value={formatDisplayValue(selected)}
        readOnly
        bg="Background"
        _placeholder={{ color: placeholderColor }}
        placeholder={placeholder}
      />
    )
  )

  const dateFormat =
    mode === 'month' ? 'MMM/yyyy' : mode === 'year' ? 'yyyy' : 'dd/MM/yyyy'

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

      <Box position="relative" className={cn(wrapperClass, themeClass)}>
        <ReactDatePicker
          selected={selected}
          onChange={onChange}
          customInput={<CustomInput />}
          showMonthYearPicker={mode === 'month'}
          showYearPicker={mode === 'year'}
          dateFormat={dateFormat}
          locale={locale}
        />

        {clearable && selected && (
          <IconButton
            aria-label="Limpar data"
            size="xs"
            variant="ghost"
            colorScheme="gray"
            position="absolute"
            top="50%"
            right="8px"
            transform="translateY(-50%)"
            onClick={() => onChange(null)}
            zIndex={1}
          >
            <LuX size={16} />
          </IconButton>
        )}
      </Box>

      {hintText && <Field.HelperText ml={1}>{hintText}</Field.HelperText>}
      <Field.ErrorText mr={1} mt={0.5} position="absolute" top={0} right={0}>
        {error}
      </Field.ErrorText>
    </Field.Root>
  )
}
