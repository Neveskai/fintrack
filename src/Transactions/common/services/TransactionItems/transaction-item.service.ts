import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  collectionGroup,
  query,
  limit
} from 'firebase/firestore'

import { db } from '@/common/services/Firebase'

import type {
  TransactionItemDTO,
  CreateTransactionItemPayload,
  UpdateTransactionItemPayload,
  ItemListFiltersDTO
} from './transaction-item.types'

const SUBCOLLECTION_NAME = 'items'

function itemsRef(transactionId: string) {
  return collection(db, 'transactions', transactionId, SUBCOLLECTION_NAME)
}

function itemRef(transactionId: string, itemId: string) {
  return doc(db, 'transactions', transactionId, SUBCOLLECTION_NAME, itemId)
}

export const TransactionItemService = {
  create: async (
    transactionId: string,
    payload: CreateTransactionItemPayload
  ): Promise<TransactionItemDTO> => {
    const ref = itemsRef(transactionId)
    const docRef = await addDoc(ref, {
      ...payload,
      transactionId
    })
    return {
      id: docRef.id,
      transactionId,
      ...payload
    }
  },

  createMany: async (
    transactionId: string,
    payloads: CreateTransactionItemPayload[]
  ): Promise<TransactionItemDTO[]> => {
    const results: TransactionItemDTO[] = []
    for (const payload of payloads) {
      const created = await TransactionItemService.create(transactionId, payload)
      results.push(created)
    }
    return results
  },

  getByTransactionId: async (
    transactionId: string
  ): Promise<TransactionItemDTO[]> => {
    const ref = itemsRef(transactionId)
    const snapshot = await getDocs(ref)
    const items = snapshot.docs.map(d => ({
      id: d.id,
      transactionId,
      ...d.data()
    })) as TransactionItemDTO[]
    return items.sort((a, b) => a.description.localeCompare(b.description))
  },

  update: async (
    transactionId: string,
    itemId: string,
    payload: UpdateTransactionItemPayload
  ): Promise<void> => {
    const ref = itemRef(transactionId, itemId)
    await updateDoc(ref, payload)
  },

  delete: async (transactionId: string, itemId: string): Promise<void> => {
    const ref = itemRef(transactionId, itemId)
    await deleteDoc(ref)
  },

  getAll: async (
    options?: ItemListFiltersDTO & { limitCount?: number }
  ): Promise<TransactionItemDTO[]> => {
    const limitCount = options?.limitCount ?? 500
    const ref = collectionGroup(db, SUBCOLLECTION_NAME)
    const q = query(ref, limit(limitCount))
    const snapshot = await getDocs(q)

    let items: TransactionItemDTO[] = snapshot.docs.map(d => {
      const transactionId = d.ref.parent.parent?.id ?? (d.data().transactionId as string)
      return {
        id: d.id,
        transactionId,
        ...d.data()
      } as TransactionItemDTO
    })

    if (options?.searchText?.trim()) {
      const term = options.searchText.trim().toLowerCase()
      items = items.filter(item =>
        (item.description ?? '').toLowerCase().includes(term)
      )
    }

    const sortBy = options?.sortBy ?? 'description'
    const sortDirection = options?.sortDirection ?? 'asc'
    const dir = sortDirection === 'asc' ? 1 : -1
    items = [...items].sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * dir
      }
      return String(aVal ?? '').localeCompare(String(bVal ?? '')) * dir
    })

    return items
  }
}
