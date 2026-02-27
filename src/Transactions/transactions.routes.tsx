import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { TransactionPanel } from './pages/Panel'
import { TransactionList } from './pages/List'
import { ItemsListPage } from './pages/ItemsList'
import { ImportPage } from './pages/Import'
import { SettingsPage } from './pages/Settings'
import { ClassificationCategoriesPage } from './pages/ClassificationCategories'
import { BudgetPage } from './pages/Budget'
import { AnimatePresence } from 'framer-motion'
import { AnimatedPage } from '@/common/ui/Animations'
import { ErrorBoundary } from '@/common/ui'

const BaseRoutes = {
  Home: '/',
  Import: '/import',
  Settings: '/settings',
  Classification: '/classification',
  Transactions: '/transactions',
  Items: '/items',
  Budget: '/budget'
}

export const TransactionRoutes = {
  Home: `/finances${BaseRoutes.Home}`,
  Import: `/finances${BaseRoutes.Import}`,
  Settings: `/finances${BaseRoutes.Settings}`,
  Classification: `/finances${BaseRoutes.Classification}`,
  Transactions: `/finances${BaseRoutes.Transactions}`,
  Items: `/finances${BaseRoutes.Items}`,
  Budget: `/finances${BaseRoutes.Budget}`
}

export const TransactionsRouter = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <AnimatedPage key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Navigate to={TransactionRoutes.Home} replace />} />
          <Route path={TransactionRoutes.Home} element={<ErrorBoundary><TransactionPanel /></ErrorBoundary>} />
          <Route path={TransactionRoutes.Transactions} element={<ErrorBoundary><TransactionList /></ErrorBoundary>} />
          <Route path={TransactionRoutes.Items} element={<ErrorBoundary><ItemsListPage /></ErrorBoundary>} />
          <Route path={TransactionRoutes.Import} element={<ErrorBoundary><ImportPage /></ErrorBoundary>} />
          <Route path={TransactionRoutes.Settings} element={<ErrorBoundary><SettingsPage /></ErrorBoundary>} />
          <Route path={TransactionRoutes.Classification} element={<ErrorBoundary><ClassificationCategoriesPage /></ErrorBoundary>} />
          <Route path={TransactionRoutes.Budget} element={<ErrorBoundary><BudgetPage /></ErrorBoundary>} />
        </Routes>
      </AnimatedPage>
    </AnimatePresence>
  )
}
