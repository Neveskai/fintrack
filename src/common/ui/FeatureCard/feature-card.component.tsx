import { useState, type ReactNode } from 'react'
import { Box, Text, VStack } from '@chakra-ui/react'

export type FeatureCardProps = {
  title: string
  description: ReactNode
  icon: ReactNode
  children: ReactNode
  defaultExpanded?: boolean
}

const CARD_RADIUS = 'md'

export const FeatureCard = ({
  title,
  description,
  icon,
  children,
  defaultExpanded = false
}: FeatureCardProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <Box w="100%" minW={0}>
      <Box
        as="button"
        type="button"
        w="100%"
        textAlign="left"
        p={4}
        py={3.5}
        borderRadius={CARD_RADIUS}
        bg="purple.600"
        _dark={{ bg: 'purple.700' }}
        color="white"
        onClick={() => setExpanded(e => !e)}
        display="flex"
        alignItems="center"
        gap={4}
        _hover={{ opacity: 0.95 }}
        transition="opacity 0.15s"
      >
        <Box p={2} borderRadius={CARD_RADIUS} bg="whiteAlpha.200">
          {icon}
        </Box>
        <VStack align="stretch" gap={0} flex={1} minW={0}>
          <Text fontWeight={600} fontSize="md">
            {title}
          </Text>
          <Text fontSize="sm" opacity={0.9}>
            {description}
          </Text>
        </VStack>
        <Box flexShrink={0}>
          {expanded ? (
            <ChevronDown aria-hidden />
          ) : (
            <ChevronRight aria-hidden />
          )}
        </Box>
      </Box>

      {expanded && (
        <VStack
          align="stretch"
          gap={3}
          p={4}
          mt={2}
          borderRadius={CARD_RADIUS}
          bg="gray.50"
          _dark={{ bg: 'gray.800' }}
        >
          {children}
        </VStack>
      )}
    </Box>
  )
}

function ChevronDown(props: { 'aria-hidden'?: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function ChevronRight(props: { 'aria-hidden'?: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
