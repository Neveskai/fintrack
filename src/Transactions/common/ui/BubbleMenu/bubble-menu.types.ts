import { MenuItemProps } from "@chakra-ui/react"
import { ReactNode } from "react"

export type BubbleMenuItem = MenuItemProps & {
  label: string
  icon: ReactNode
  onClick?: () => void
}

export type BubbleMenuProps = {
  trigger: ReactNode
  horizontalMenuItems?: BubbleMenuItem[]
  verticalMenuItems?: BubbleMenuItem[]
}
export type Timeout = ReturnType<typeof setTimeout>
