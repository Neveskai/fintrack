import { Box, Button, EmptyState, Text, VStack } from '@/common/ui'
import { useNavigate } from 'react-router-dom'
import { TransactionRoutes } from '@/Transactions/transactions.routes'
import { FiUpload } from 'react-icons/fi'

type TransactionsEmptyOrErrorStateProps = {
  onRetry: () => void
}

export const TransactionsEmptyOrErrorState = ({ onRetry }: TransactionsEmptyOrErrorStateProps) => {
  const navigate = useNavigate()

  return (
    <EmptyState
      title="Nenhuma transação no banco"
      description="Não há registros de transações no período. Isso é comum ao começar: importe suas faturas ou adicione transações para começar a usar o FinTrack."
      illustrationSize={160}
      action={
        <VStack gap={3} w="100%" maxW="400px" align="stretch">
          <Box
            p={4}
            borderRadius="md"
            bg="gray.50"
            _dark={{ bg: 'gray.800' }}
            textAlign="left"
          >
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="fg">
              Como começar
            </Text>
            <VStack align="stretch" gap={2} fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
              <Text>
                <strong>1. Importar CSV</strong> — Use o botão &quot;Importar CSV&quot; no topo da página para enviar a fatura do seu cartão (formato CSV do seu banco).
              </Text>
              <Text>
                <strong>2. Período</strong> — Confira o mês selecionado no seletor acima; às vezes não há transações naquele período.
              </Text>
              <Text>
                <strong>3. Tentar de novo</strong> — Se você já importou e a lista não apareceu, clique em &quot;Tentar novamente&quot; abaixo.
              </Text>
            </VStack>
          </Box>
          <VStack gap={2} w="100%">
            <Button w="100%" colorPalette="purple" onClick={() => navigate(TransactionRoutes.Import)}>
              <FiUpload />
              Ir para Importar CSV
            </Button>
            <Button w="100%" variant="outline" colorPalette="gray" onClick={onRetry}>
              Tentar novamente
            </Button>
          </VStack>
        </VStack>
      }
    />
  )
}
