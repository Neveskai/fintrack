import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/common/services/Firebase'
import type {
  UserSettingsDTO,
  ClassificationRuleDTO,
  CustomCategoryDTO,
  BudgetDTO
} from './user-settings.types'

const COLLECTION_NAME = 'users'

function settingsRef(userId: string) {
  return doc(db, COLLECTION_NAME, userId)
}

export const UserSettingsService = {
  get: async (userId: string): Promise<UserSettingsDTO> => {
    const ref = settingsRef(userId)
    const snapshot = await getDoc(ref)
    return (snapshot.data() as UserSettingsDTO) ?? {}
  },

  setCreditCardDueDay: async (
    userId: string,
    creditCardDueDay: number | undefined
  ): Promise<void> => {
    const ref = settingsRef(userId)
    await setDoc(ref, { creditCardDueDay }, { merge: true })
  },

  setClassificationRules: async (
    userId: string,
    classificationRules: ClassificationRuleDTO[]
  ): Promise<void> => {
    const ref = settingsRef(userId)
    await setDoc(ref, { classificationRules }, { merge: true })
  },

  setCustomCategories: async (
    userId: string,
    customCategories: CustomCategoryDTO[]
  ): Promise<void> => {
    const ref = settingsRef(userId)
    await setDoc(ref, { customCategories }, { merge: true })
  },

  setBudgets: async (
    userId: string,
    budgets: BudgetDTO[]
  ): Promise<void> => {
    const ref = settingsRef(userId)
    await setDoc(ref, { budgets }, { merge: true })
  }
}
