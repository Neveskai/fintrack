import { useState } from 'react'
import { Box, UserAvatar, Tabs, Text, useToken, Dialog, Portal, VStack, IconButton, Tooltip } from '@/common/ui'
import { FiList, FiMenu, FiPackage, FiTag, FiSettings, FiPieChart } from 'react-icons/fi'
import { BiBarChart } from 'react-icons/bi'
import { useLocation, useNavigate } from 'react-router-dom'

import { TransactionRoutes } from '@/Transactions/transactions.routes'
import { ThemeButton } from '@/common/ui/ThemeButton'
import { useTheme } from 'next-themes'
import cn from 'classnames'

import './navbar.styles.css'

const getTabValue = (path: string): string => {
  if (path.startsWith(TransactionRoutes.Transactions)) return TransactionRoutes.Transactions
  if (path.startsWith(TransactionRoutes.Items)) return TransactionRoutes.Items
  if (path.startsWith(TransactionRoutes.Import)) return TransactionRoutes.Import
  if (path.startsWith(TransactionRoutes.Settings)) return TransactionRoutes.Settings
  if (path.startsWith(TransactionRoutes.Classification)) return TransactionRoutes.Classification
  if (path.startsWith(TransactionRoutes.Budget)) return TransactionRoutes.Budget
  if (path.startsWith(TransactionRoutes.Home)) return TransactionRoutes.Home

  return path
}

const navItems = [
  { value: TransactionRoutes.Home, label: 'Painel', Icon: BiBarChart, size: 24 },
  { value: TransactionRoutes.Transactions, label: 'Transações', Icon: FiList, size: 20 },
  { value: TransactionRoutes.Items, label: 'Itens', Icon: FiPackage, size: 20 },
  { value: TransactionRoutes.Budget, label: 'Orçamentos', Icon: FiPieChart, size: 20 },
  { value: TransactionRoutes.Classification, label: 'Classificação', Icon: FiTag, size: 20 },
  { value: TransactionRoutes.Settings, label: 'Configurações', Icon: FiSettings, size: 20 }
] as const

export const NavBar = () => {
  const userName = 'Wendell'
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname
  const currentTab = getTabValue(currentPath)
  const [menuOpen, setMenuOpen] = useState(false)

  const { resolvedTheme } = useTheme()

  const borderColor = resolvedTheme === 'light' ? 'gray.200' : 'gray.700'

  const [blue, blue400] = useToken('colors', ['blue', 'blue.400'])
  const activeColor = resolvedTheme === 'light' ? blue : blue400

  const isActiveColor = (tab: string) => {
    return currentTab === tab ? activeColor : undefined
  }

  const BoxClass = cn('SideBar', { dark: resolvedTheme === 'dark' })

  const handleTabChange = (details: { value: string }) => {
    navigate(details.value + location.search)
  }

  const handleMobileNav = (value: string) => {
    navigate(value + location.search)
    setMenuOpen(false)
  }

  return (
    <Box className={BoxClass} borderColor={borderColor}>
      <Box
        className="NavBar-logo"
        display="flex"
        alignItems="center"
        gap={2}
        cursor="pointer"
        onClick={() => navigate('/')}
      >
        <img src="/logo.svg" alt="FinTrack" width={28} height={28} />
        <Text fontSize="lg" fontWeight="bold" letterSpacing="tight">
          FinTrack
        </Text>
      </Box>

      {/* Desktop: apenas ícones + tooltip (barra mais limpa) */}
      <Box className="NavBar-desktop">
        <Tabs.Root value={currentTab} onValueChange={handleTabChange} colorPalette="blue">
          <Tabs.List className="NavBar-tabsList">
            {navItems.map(({ value, label, Icon, size }) => (
              <Tooltip key={value} content={label} openDelay={300} closeDelay={100}>
                <Tabs.Trigger value={value} className="NavBar-tabTrigger NavBar-tabTrigger--iconOnly" height="44px">
                  <Icon size={size} color={isActiveColor(value)} aria-hidden />
                </Tabs.Trigger>
              </Tooltip>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </Box>

      {/* Mobile: hamburger que abre o menu */}
      <IconButton
        className="NavBar-menuButton"
        aria-label="Abrir menu"
        variant="ghost"
        size="lg"
        onClick={() => setMenuOpen(true)}
      >
        <FiMenu size={24} />
      </IconButton>

      <Box
        className="NavBar-actions"
        gap={4}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <ThemeButton />
        <UserAvatar name={userName} />
      </Box>

      {/* Drawer mobile */}
      <Dialog.Root open={menuOpen} onOpenChange={e => setMenuOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner className="NavBar-drawerPositioner">
            <Dialog.Content
              className="NavBar-drawer"
              maxW="100vw"
              w="min(320px, 100vw)"
              mx={{ base: 0, sm: 'auto' }}
            >
              <Dialog.Header>
                <Dialog.Title>Menu</Dialog.Title>
                <Dialog.CloseTrigger />
              </Dialog.Header>
              <Dialog.Body flex="1" display="flex" flexDirection="column">
                <VStack flex="1" align="stretch" gap={1} py={2}>
                  {navItems.map(({ value, label, Icon, size }) => (
                    <Box
                      key={value}
                      as="button"
                      className={cn('NavBar-drawerItem', { active: currentTab === value })}
                      onClick={() => handleMobileNav(value)}
                      display="flex"
                      alignItems="center"
                      gap={3}
                      w="100%"
                      py={3}
                      px={3}
                      textAlign="left"
                      border="none"
                      cursor="pointer"
                      borderRadius="md"
                      bg={currentTab === value ? 'gray.100' : 'transparent'}
                      _hover={{ bg: 'gray.50' }}
                      _dark={{ _hover: { bg: 'whiteAlpha.100' }, bg: currentTab === value ? 'whiteAlpha.200' : 'transparent' }}
                    >
                      <Icon size={size} color={isActiveColor(value)} />
                      <Text fontSize="16px" fontWeight={currentTab === value ? 'semibold' : 'normal'}>
                        {label}
                      </Text>
                    </Box>
                  ))}
                </VStack>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={4}
                  pt={4}
                  borderTopWidth="1px"
                  borderColor={borderColor}
                >
                  <ThemeButton />
                  <UserAvatar name={userName} />
                </Box>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  )
}
