import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore'

import { db } from '@/common/services/Firebase'
import { getCurrentUserId } from '@/common/stores'
import type { CategoryEnum } from '@/Transactions/common/enums'
import type {
  CounterpartyDTO,
  CreateCounterpartyPayload,
  UpdateCounterpartyPayload
} from './counterparty.types'

const COLLECTION_NAME = 'counterparties'

function normalizeName(name: string): string {
  return name.trim().toLowerCase()
}

export const CounterpartyService = {
  normalizeName,

  getAll: async (): Promise<CounterpartyDTO[]> => {
    const userId = getCurrentUserId()
    const ref = collection(db, COLLECTION_NAME)
    const q = query(ref, where('userId', '==', userId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as CounterpartyDTO[]
  },

  /** Map: nameNormalized -> defaultCategory (for quick lookup on import) */
  getAllAsMap: async (): Promise<Map<string, CategoryEnum>> => {
    const list = await CounterpartyService.getAll()
    const map = new Map<string, CategoryEnum>()
    for (const c of list) {
      map.set(c.nameNormalized, c.defaultCategory)
    }
    return map
  },

  getByNormalizedName: async (
    nameNormalized: string
  ): Promise<CounterpartyDTO | null> => {
    const userId = getCurrentUserId()
    const ref = collection(db, COLLECTION_NAME)
    const q = query(ref, where('userId', '==', userId), where('nameNormalized', '==', nameNormalized))
    const snapshot = await getDocs(q)
    if (snapshot.empty) return null
    const docSnap = snapshot.docs[0]
    return { id: docSnap.id, ...docSnap.data() } as CounterpartyDTO
  },

  create: async (
    payload: CreateCounterpartyPayload
  ): Promise<CounterpartyDTO> => {
    const userId = getCurrentUserId()
    const ref = collection(db, COLLECTION_NAME)
    const docRef = await addDoc(ref, { ...payload, userId })
    return { id: docRef.id, ...payload }
  },

  update: async (
    id: string,
    payload: UpdateCounterpartyPayload
  ): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, { ...payload })
  },

  /**
   * Cria ou atualiza o cadastro do nome com a categoria padrão.
   * Usado ao salvar uma transação (edição) para que próximas com o mesmo nome usem essa categoria.
   */
  upsertDefaultCategory: async (
    name: string,
    defaultCategory: CategoryEnum
  ): Promise<void> => {
    const trimmed = name.trim()
    if (!trimmed) return

    const nameNormalized = normalizeName(trimmed)
    const existing = await CounterpartyService.getByNormalizedName(nameNormalized)

    if (existing) {
      await CounterpartyService.update(existing.id, {
        name: trimmed,
        defaultCategory
      })
    } else {
      await CounterpartyService.create({
        name: trimmed,
        nameNormalized,
        defaultCategory
      })
    }
  }
}
