import { Button, EmptyState, VStack } from '@/common/ui'
import { useNavigate } from 'react-router-dom'
import { TransactionRoutes } from '@/Transactions/transactions.routes'
import { BsListUl, BsArrowClockwise } from 'react-icons/bs'

type ItemsListEmptyStateProps = {
  onNavigateToTransactions?: () => void
  isError?: boolean
  onRetry?: () => void
}

export const ItemsListEmptyState = ({
  onNavigateToTransactions,
  isError = false,
  onRetry
}: ItemsListEmptyStateProps) => {
  const navigate = useNavigate()

  const handleNavigate = () => {
    if (onNavigateToTransactions) {
      onNavigateToTransactions()
    } else {
      navigate(TransactionRoutes.Transactions)
    }
  }

  const title = isError ? 'Não foi possível carregar os itens' : 'Nenhum item encontrado'
  const description = isError
    ? 'Algo deu errado ao buscar os itens. Verifique sua conexão ou tente novamente.'
    : 'Não há itens nas suas transações para o período ou filtros selecionados. Tente outro mês ou busca.'

  return (
    <EmptyState
      title={title}
      description={description}
      illustrationSize={160}
      action={
        <VStack gap={2} w="100%" maxW="320px">
          {isError && onRetry && (
            <Button w="100%" colorPalette="blue" onClick={onRetry}>
              <BsArrowClockwise />
              Tentar novamente
            </Button>
          )}
          <Button w="100%" colorPalette="purple" onClick={handleNavigate}>
            <BsListUl />
            Ver transações
          </Button>
        </VStack>
      }
    />
  )
}
