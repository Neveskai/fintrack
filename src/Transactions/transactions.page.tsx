import { NavBar } from '@/Transactions/common/ui'
import { Box } from '@/common/ui'
import { useTheme } from 'next-themes'
import { TransactionsRouter } from './transactions.routes'
import { OfflineBanner } from '@/common/ui/OfflineBanner'
import { CategoryRegistrySync } from '@/Transactions/common/CategoryRegistrySync/category-registry-sync.component'

export const TransactionsPage = () => {
  const { resolvedTheme } = useTheme()

  const bgColor = resolvedTheme === 'light' ? '#fdfeff' : 'gray.900'

  return (
    <>
      <CategoryRegistrySync />
    <Box
      bg={bgColor}
      height="100vh"
      display="flex"
      minWidth={0}
      minHeight="100vh"
      overflowY="auto"
      overflowX="hidden"
      className="scrollbar-thin"
      flexDirection="column"
    >
      <NavBar />

      <Box flex="1" minHeight={0} display="flex" flexDirection="column">
        <TransactionsRouter />
      </Box>

      <OfflineBanner />
    </Box>
    </>
  )
}
