import {
  Select as ChakraSelect,
  Field,
  FieldRootProps,
  HStack,
  Text,
  createListCollection,
  type SelectValueChangeDetails
} from '@chakra-ui/react'
import { useTheme } from 'next-themes'
import { Tooltip } from '../Tooltip'
import { LuInfo } from 'react-icons/lu'
import type { ReactNode } from 'react'

export type SelectOption = {
  label: string
  value: string
}

type CustomSelectProps = Omit<FieldRootProps, 'value' | 'onChange'> & {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  label?: string
  helpText?: ReactNode
  hintText?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  error?: string
  clearable?: boolean
  fieldProps?: object
}

export const Select = ({
  value,
  onChange,
  options,
  placeholder = 'Selecione uma opção',
  label,
  helpText,
  hintText,
  required,
  size = 'md',
  error,
  clearable = true,
  ...props
}: CustomSelectProps) => {
  const collection = createListCollection({
    items: [...options]
  })

  const { resolvedTheme } = useTheme()
  const placeholderColor = resolvedTheme === 'light' ? 'gray.400' : 'gray.500'
  const redColor = resolvedTheme === 'light' ? 'red.400' : 'red.600'

  return (
    <Field.Root invalid={!!error} {...props}>
      <ChakraSelect.Root
        value={value ? [value] : []}
        onValueChange={(details: SelectValueChangeDetails<SelectOption>) => {
          const selected = details.items[0]?.value ?? ''
          onChange(selected)
        }}
        size={size}
        collection={collection}
      >
        <ChakraSelect.HiddenSelect />

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

        <ChakraSelect.Control>
          <ChakraSelect.Trigger
            cursor="pointer"
            bg="Background"
            color={props.disabled ? placeholderColor : undefined}
          >
            <ChakraSelect.ValueText
              placeholder={placeholder}
              color={!value ? placeholderColor : undefined}
            />
          </ChakraSelect.Trigger>

          <ChakraSelect.IndicatorGroup>
            {clearable && <ChakraSelect.ClearTrigger />}
            <ChakraSelect.Indicator />
          </ChakraSelect.IndicatorGroup>
        </ChakraSelect.Control>

        <ChakraSelect.Positioner>
          <ChakraSelect.Content>
            {collection.items.map(item => (
              <ChakraSelect.Item key={item.value} item={item} cursor="pointer">
                {item.label}
                <ChakraSelect.ItemIndicator />
              </ChakraSelect.Item>
            ))}
          </ChakraSelect.Content>
        </ChakraSelect.Positioner>
      </ChakraSelect.Root>

      {hintText && <Field.HelperText ml={1}>{hintText}</Field.HelperText>}
      <Field.ErrorText mr={1} mt={0.5} position="absolute" top={0} right={0}>
        {error}
      </Field.ErrorText>
    </Field.Root>
  )
}
