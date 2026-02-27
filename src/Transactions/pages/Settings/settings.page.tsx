import {
  Page,
  Box,
  Text,
  VStack,
  Select,
  Button,
  FeatureCard
} from '@/common/ui'
import { Link } from 'react-router-dom'
import { BsGear } from 'react-icons/bs'
import { TransactionRoutes } from '@/Transactions/transactions.routes'
import { useUserSettings } from '@/common/hooks'

const dayOptions = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1
  return { label: `Dia ${day}`, value: String(day) }
})

export const SettingsPage = () => {
  const {
    isSaving,
    isSettingsError,
    creditCardDueDay,
    isSettingsLoading,
    setCreditCardDueDay
  } = useUserSettings()

  const value = creditCardDueDay != null ? String(creditCardDueDay) : ''

  return (
    <Page.Root isLoading={isSettingsLoading} isError={isSettingsError}>
      <Page.Header
        breadcrumb={[
          { label: 'Início', href: TransactionRoutes.Home },
          { label: 'Configurações' }
        ]}
        title="Configurações"
        description="Preferências da sua conta"
      />

      <Page.Body gap={6}>
        <FeatureCard
          title="Configurações do assistente"
          description="Ajuste preferências para que relatórios, filtros e totais reflitam melhor a sua realidade — por exemplo, o ciclo do cartão de crédito."
          icon={<BsGear size={24} />}
        >
          <Text fontSize="sm">
            <strong>Dia do vencimento:</strong> define o ciclo de fatura do cartão. Ao filtrar por “Cartão de Crédito”, o mês segue do vencimento ao próximo.
          </Text>
          <Text fontSize="sm">
            <strong>Classificação e Categorias:</strong> regras para importação CSV e categorias personalizadas, acessíveis pelo botão abaixo.
          </Text>
        </FeatureCard>

        <VStack align="stretch" gap={2}>
          <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
            Cartão de crédito — ciclo de fatura
          </Text>
          <Box maxW="280px">
            <Select
              label="Dia do vencimento do cartão"
              placeholder="Não configurado (usar mês calendário)"
              value={value}
              onChange={v =>
                setCreditCardDueDay(v ? Number(v) : undefined)
              }
              options={dayOptions}
              clearable
            />
          </Box>
          <Text fontSize="xs" color="gray.500" _dark={{ color: 'gray.500' }}>
            Ao filtrar transações por “Cartão de Crédito”, o período (Mês/Ano)
            será o ciclo de fatura: do dia do vencimento ao dia anterior ao
            próximo vencimento. Ex.: vencimento dia 10 — “Fechamento Janeiro” =
            registros de 10/jan a 09/fev.
          </Text>
          {isSaving && (
            <Text fontSize="sm" color="blue.500">
              Salvando…
            </Text>
          )}
        </VStack>

        <VStack align="stretch" gap={2}>
          <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
            Classificação e Categorias
          </Text>
          <Text fontSize="xs" color="gray.500" _dark={{ color: 'gray.500' }}>
            Gerencie regras de classificação para importação CSV e categorias customizadas.
          </Text>
          <Box>
            <Button asChild>
              <Link to={TransactionRoutes.Classification}>
                Abrir Classificação e Categorias
              </Link>
            </Button>
          </Box>
        </VStack>
      </Page.Body>
    </Page.Root>
  )
}
