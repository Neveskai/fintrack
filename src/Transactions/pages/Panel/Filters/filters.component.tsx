import { Text } from '@chakra-ui/react'
import { FeatureCard } from '@/common/ui'
import { useUserSettings } from '@/common/hooks'
import { FiCreditCard } from 'react-icons/fi'

export const Filters = () => {
  const { creditCardDueDay } = useUserSettings()

  if (creditCardDueDay == null) return null

  return (
    <FeatureCard
      title="Período de fechamento do cartão"
      description={
        <>
          Período: dia {creditCardDueDay} ao dia {creditCardDueDay} do mês
          seguinte (vencimento do cartão)
        </>
      }
      icon={<FiCreditCard size={24} />}
    >
      <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
        O painel usa o dia de vencimento do seu cartão de crédito para
        agrupar as transações por <strong>ciclo de fechamento</strong>.
      </Text>
      <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
        O mês exibido no título refere-se ao período da fatura: por exemplo,
        &quot;Fevereiro&quot; com vencimento dia {creditCardDueDay} mostra
        transações do dia {creditCardDueDay} de janeiro ao dia{' '}
        {creditCardDueDay} de fevereiro — ou seja, a fatura que vence em
        fevereiro.
      </Text>
      <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
        Assim você compara os gastos diretamente com a fatura do cartão e
        acompanha orçamentos no mesmo período. O dia de vencimento pode
        ser alterado em <strong>Configurações</strong>.
      </Text>
    </FeatureCard>
  )
}
