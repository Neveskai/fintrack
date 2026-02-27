import { CategoryEnum } from '@/Transactions/common/enums'

export type CounterpartyDTO = {
  id: string
  name: string
  nameNormalized: string
  defaultCategory: CategoryEnum
}

export type CreateCounterpartyPayload = {
  name: string
  nameNormalized: string
  defaultCategory: CategoryEnum
}

export type UpdateCounterpartyPayload = Partial<{
  name: string
  nameNormalized: string
  defaultCategory: CategoryEnum
}>
