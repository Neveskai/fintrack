import {
  Portal,
  MenuItem,
  MenuContent,
  MenuPositioner,
  MenuTrigger,
  MenuRoot,
  Group,
  Box,
  Text,
  MenuOpenChangeDetails
} from '@chakra-ui/react'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import { BubbleMenuItem, BubbleMenuProps } from './bubble-menu.types'

export const BubbleMenu: React.FC<BubbleMenuProps> = ({
  trigger,
  horizontalMenuItems,
  verticalMenuItems
}) => {
  const { resolvedTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [mouseX, setMouseX] = useState<number | null>(null)

  const bgColor = resolvedTheme === 'light' ? '#fcfdff' : 'gray.800'

  const onClick = (event: React.MouseEvent) => {
    setMouseX(event.clientX)
    setOpen(true)
  }

  const handleMouseLeave = () => {
    setTimeout(() => {
      setOpen(false)
    }, 100)
  }

  const onOpenChange = (details: MenuOpenChangeDetails) => {
    setOpen(details.open)
  }

  const onClickItem = (item: BubbleMenuItem) => {
    if (item.onClick) item?.onClick()
    setOpen(false)
  }

  return (
    <MenuRoot
      open={open}
      onOpenChange={onOpenChange}
      positioning={{ placement: 'top-start' }}
    >
      <MenuTrigger asChild>
        <Box onClick={onClick}>{trigger}</Box>
      </MenuTrigger>

      <Portal>
        <MenuPositioner
          onMouseLeave={handleMouseLeave}
          marginTop="10px"
          marginLeft="-190px"
          style={{
            left: mouseX !== null ? `${mouseX}px` : '0px'
          }}
        >
          <MenuContent
            minW="unset"
            borderRadius="md"
            bg={bgColor}
            p={1}
            transform="translate(0, 100%)"
          >
            <Group gap={0}>
              {horizontalMenuItems?.map(item => (
                <MenuItem
                  key={item.value}
                  value={item.value}
                  onClick={() => onClickItem(item)}
                  disabled={item.disabled}
                  cursor="pointer"
                  borderRadius="md"
                  width="fit-content"
                  minW="70px"
                  py={2}
                  flexDirection="column"
                  fontWeight={500}
                  {...item?.css}
                >
                  {item.icon}
                  <Text>{item.label}</Text>
                </MenuItem>
              ))}
            </Group>

            {verticalMenuItems?.map(item => (
              <MenuItem
                key={item.value}
                value={item.value}
                onClick={item?.onClick}
                disabled={item.disabled}
                width="100%"
                cursor="pointer"
                borderRadius="md"
                p={2}
                fontWeight={500}
                {...item?.css}
              >
                {item.icon}
                <Box flex={1}>{item.label}</Box>
              </MenuItem>
            ))}
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  )
}
