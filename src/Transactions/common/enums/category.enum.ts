export type CategoryItem = { id: number; name: string }

export abstract class Category {
  public static readonly ALIMENTACAO = 1 as const
  public static readonly TRANSPORTE = 2 as const
  public static readonly MORADIA = 3 as const
  public static readonly EDUCACAO = 4 as const
  public static readonly SAUDE = 5 as const
  public static readonly ASSINATURAS = 6 as const
  public static readonly TRANSFERENCIA = 7 as const
  public static readonly INVESTIMENTO = 8 as const
  public static readonly COMPRAS = 9 as const
  public static readonly LAZER = 10 as const
  public static readonly OUTROS = 11 as const

  public static readonly VALUES: readonly CategoryItem[] = [
    { id: 1, name: 'Alimentação' },
    { id: 2, name: 'Transporte' },
    { id: 3, name: 'Moradia' },
    { id: 4, name: 'Educação' },
    { id: 5, name: 'Saúde' },
    { id: 6, name: 'Assinaturas' },
    { id: 7, name: 'Transferência' },
    { id: 8, name: 'Investimento' },
    { id: 9, name: 'Compras' },
    { id: 10, name: 'Lazer' },
    { id: 11, name: 'Outros' }
  ] as const

  private static _customCategories: CategoryItem[] = []

  public static setCustomCategories(categories: CategoryItem[]): void {
    this._customCategories = [...categories]
  }

  public static getMergedValues(): CategoryItem[] {
    return [...this.VALUES, ...this._customCategories]
  }

  public static fromId(id: number): CategoryItem | undefined {
    const system = this.VALUES.find(option => option.id === id)
    if (system) return system
    return this._customCategories.find(c => c.id === id)
  }
}

export type CategoryType = (typeof Category.VALUES)[number]
/** System (1–11) or custom (e.g. ≥1000) category id */
export type CategoryEnum = number
