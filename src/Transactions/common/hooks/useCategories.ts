import { useMemo } from 'react'
import type { SelectOption } from '@/common/ui/Select'
import { Category } from '@/Transactions/common/enums'
import { useUserSettings } from '@/common/hooks'

export function useCategories() {
  const { settings } = useUserSettings()
  const customCategories = settings?.customCategories ?? []

  const categoryOptions: SelectOption[] = useMemo(
    () =>
      [...Category.VALUES, ...customCategories].map(({ id, name }) => ({
        label: name,
        value: String(id)
      })),
    [customCategories]
  )

  const getCategoryById = (id: number) => Category.fromId(id)

  return { categoryOptions, getCategoryById }
}
