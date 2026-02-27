export abstract class Source {
  public static readonly CONTA_CORRENTE = 1 as const
  public static readonly CARTAO_CREDITO = 2 as const

  public static readonly VALUES = [
    { id: 1 as const, name: 'Conta Corrente' },
    { id: 2 as const, name: 'Cartão de Crédito' }
  ] as const

  public static fromId(id: SourceEnum): SourceType | undefined {
    return this.VALUES.find(option => option.id === id)
  }
}

export type SourceType = (typeof Source.VALUES)[number]
export type SourceEnum = SourceType['id']
