import { useEffect } from 'react'
import { useUserSettings } from '@/common/hooks'
import { Category } from '@/Transactions/common/enums'

/**
 * Syncs user custom categories from settings into Category registry so
 * Category.fromId() and Category.getMergedValues() include them.
 */
export const CategoryRegistrySync = () => {
  const { settings } = useUserSettings()

  useEffect(() => {
    Category.setCustomCategories(settings?.customCategories ?? [])
  }, [settings?.customCategories])

  return null
}
