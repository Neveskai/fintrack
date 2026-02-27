import {
  Breadcrumb as BreadcrumbChakra,
  type BreadcrumbRootProps,
  IconButton,
  HStack
} from '@chakra-ui/react'
import React from 'react'
import { FiArrowLeft } from 'react-icons/fi'

type Route = {
  label: string
  href?: string
}

type BreadcrumbNavProps = BreadcrumbRootProps & {
  routes: Route[]
  variant?: 'plain' | 'underline'
}

export const Breadcrumb = ({
  routes,
  variant = 'plain',
  ...props
}: BreadcrumbNavProps) => {
  const lastIndex = routes.length - 1

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <HStack align="center" gap={0}>
      <IconButton
        onClick={handleGoBack}
        variant="ghost"
        size="xs"
        minW={4}
        h={2}
        mr={3}
      >
        <FiArrowLeft />
      </IconButton>

      <BreadcrumbChakra.Root variant={variant} {...props}>
        <BreadcrumbChakra.List>
          {routes.map((route, index) => (
            <React.Fragment key={route.label + index}>
              <BreadcrumbChakra.Item>
                {index === lastIndex ? (
                  <BreadcrumbChakra.CurrentLink>
                    {route.label}
                  </BreadcrumbChakra.CurrentLink>
                ) : (
                  <BreadcrumbChakra.Link href={route.href}>
                    {route.label}
                  </BreadcrumbChakra.Link>
                )}
              </BreadcrumbChakra.Item>
              {index < lastIndex && <BreadcrumbChakra.Separator />}
            </React.Fragment>
          ))}
        </BreadcrumbChakra.List>
      </BreadcrumbChakra.Root>
    </HStack>
  )
}
