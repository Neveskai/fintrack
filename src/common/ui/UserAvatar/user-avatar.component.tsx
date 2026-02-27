import {
  Box,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
  Text,
} from '@chakra-ui/react'
import { FiLogOut } from 'react-icons/fi'
import { useAuthStore } from '@/common/stores'
import { Text as CustomText } from '../Text'

interface UserAvatarProps {
  name: string
}

export const UserAvatar = ({ name }: UserAvatarProps) => {
  const initial = name.charAt(0).toUpperCase()
  const signOut = useAuthStore((s) => s.signOut)

  const avatarBox = (
    <Box
      width="32px"
      height="32px"
      borderRadius="full"
      bg="gray.800"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontWeight="bold"
      fontSize="13px"
      cursor="pointer"
    >
      <CustomText w="unset">{initial}</CustomText>
    </Box>
  )

  return (
    <MenuRoot positioning={{ placement: 'bottom-end' }}>
      <MenuTrigger asChild>{avatarBox}</MenuTrigger>
      <Portal>
        <MenuPositioner>
          <MenuContent minW="140px" borderRadius="md" py={1}>
            <MenuItem
              value="logout"
              onClick={() => signOut()}
              cursor="pointer"
              gap={2}
              color="red.500"
            >
              <FiLogOut size={16} />
              <Text>Sair</Text>
            </MenuItem>
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  )
}
