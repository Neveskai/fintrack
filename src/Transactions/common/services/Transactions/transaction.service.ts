import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  writeBatch
} from 'firebase/firestore'

import { db } from '@/common/services/Firebase'
import { getCurrentUserId } from '@/common/stores'

import { Source } from '@/Transactions/common/enums'
import {
  CreateTransactionPayload,
  FiltersDTO,
  PaginateDTO,
  SortDTO,
  TransactionDTO,
  TransactionPaginatedResponseDTO,
  UpdateTransactionPayload
} from './transaction.types'

const COLLECTION_NAME = 'transactions'
const CREDIT_CARD_SOURCE = Source.CARTAO_CREDITO

const MAX_BATCH_SIZE = 500

/** Dados vindos do Firestore podem ter source e userId; filtramos e removemos do DTO. */
type RawItem = TransactionDTO & { source?: number; userId?: string }

function applyFilters(
  items: RawItem[],
  filters?: FiltersDTO
): RawItem[] {
  let result = items.filter(t => t.source === CREDIT_CARD_SOURCE)

  if (filters?.category) {
    result = result.filter(t => t.category === filters.category)
  }

  if (filters?.searchText?.trim()) {
    const term = filters.searchText.trim().toLowerCase()
    result = result.filter(
      t => (t.description ?? '').toLowerCase().includes(term)
    )
  }

  return result
}

function toDto(item: RawItem): TransactionDTO {
  const { source: _s, userId: _u, ...dto } = item
  return dto as TransactionDTO
}

function applySort(items: RawItem[], sort?: SortDTO): RawItem[] {
  if (!sort?.sortBy) return items

  const dir = sort.sortDirection === 'asc' ? 1 : -1

  return [...items].sort((a, b) => {
    const aVal = a[sort.sortBy!]
    const bVal = b[sort.sortBy!]

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * dir
    }

    return String(aVal).localeCompare(String(bVal)) * dir
  })
}

function getMonthRange(selectedDate: string): { start: string; end: string } {
  const [year, month] = selectedDate.split('-')

  const nextMonth = Number(month) + 1
  const end =
    nextMonth > 12
      ? `${Number(year) + 1}-01-01`
      : `${year}-${String(nextMonth).padStart(2, '0')}-01`

  return { start: `${year}-${month}-01`, end }
}

function lastDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/**
 * Período do ciclo de fatura por vencimento.
 * Ex.: selectedDate "2025-01" e dueDay 10 → start 2025-01-10, end 2025-02-10 (exclusive).
 */
function getBillingCycleRange(
  selectedDate: string,
  dueDay: number
): { start: string; end: string } {
  const [yearStr, monthStr] = selectedDate.split('-')
  
  const year = Number(yearStr)
  const month = Number(monthStr)

  const startDay = Math.min(dueDay, lastDayOfMonth(year, month))
  const start = `${yearStr}-${monthStr}-${String(startDay).padStart(2, '0')}`

  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year
  const endDay = Math.min(dueDay, lastDayOfMonth(nextYear, nextMonth))
  const end = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`

  return { start, end }
}

/**
 * Normalizes description for import deduplication (trim + collapse multiple spaces).
 */
function normalizeDescription(description: string): string {
  return (description ?? '').replace(/\s+/g, ' ').trim()
}

/**
 * Builds a unique key for import deduplication: date + description + amount + type.
 * Used both when querying existing transactions and when filtering CSV payloads.
 */
export function toImportKey(
  date: string,
  description: string,
  amount: number,
  type: number
): string {
  const desc = normalizeDescription(description)
  return `${date}|${desc}|${amount}|${type}`
}

export const TransactionService = {
  create: async (payload: CreateTransactionPayload): Promise<TransactionDTO> => {
    const userId = getCurrentUserId()
    const ref = collection(db, COLLECTION_NAME)
    const docRef = await addDoc(ref, { ...payload, source: CREDIT_CARD_SOURCE, userId })
    return { id: docRef.id, ...payload }
  },

  createMany: async (
    payloads: CreateTransactionPayload[]
  ): Promise<TransactionDTO[]> => {
    const userId = getCurrentUserId()
    const results: TransactionDTO[] = []

    for (let i = 0; i < payloads.length; i += MAX_BATCH_SIZE) {
      const chunk = payloads.slice(i, i + MAX_BATCH_SIZE)
      const batch = writeBatch(db)

      for (const payload of chunk) {
        const docRef = doc(collection(db, COLLECTION_NAME))
        batch.set(docRef, { ...payload, source: CREDIT_CARD_SOURCE, userId })
        results.push({ id: docRef.id, ...payload })
      }

      await batch.commit()
    }

    return results
  },

  update: async (
    id: string,
    payload: UpdateTransactionPayload
  ): Promise<TransactionDTO | undefined> => {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, { ...payload })
    return undefined
  },

  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
  },

  /**
   * Returns the set of import keys (date|description|amount|type) for credit-card
   * transactions in the given date range. Used to avoid duplicate CSV imports.
   */
  getExistingImportKeys: async (
    startDate: string,
    endDate: string
  ): Promise<Set<string>> => {
    const userId = getCurrentUserId()
    const ref = collection(db, COLLECTION_NAME)
    const q = query(
      ref,
      where('userId', '==', userId),
      where('source', '==', CREDIT_CARD_SOURCE),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    )
    const snapshot = await getDocs(q)
    const keys = new Set<string>()
    for (const d of snapshot.docs) {
      const data = d.data() as {
        date: string
        description?: string
        amount?: number
        type?: number
      }
      const key = toImportKey(
        data.date ?? '',
        data.description ?? '',
        data.amount ?? 0,
        data.type ?? 0
      )
      keys.add(key)
    }
    return keys
  },

  /** Returns true if at least one transaction uses this category (for custom category delete validation). */
  hasTransactionsWithCategory: async (categoryId: number): Promise<boolean> => {
    const userId = getCurrentUserId()
    const ref = collection(db, COLLECTION_NAME)
    const q = query(
      ref,
      where('userId', '==', userId),
      where('source', '==', CREDIT_CARD_SOURCE),
      where('category', '==', categoryId),
      limit(1)
    )
    const snapshot = await getDocs(q)
    return !snapshot.empty
  },

  readManyPaginated: async (
    filters?: FiltersDTO,
    paginate?: PaginateDTO,
    sort?: SortDTO,
    /** Se não informado, usa getCurrentUserId(). Passar o uid do usuário autenticado evita race e garante consistência com a UI. */
    userIdOverride?: string
  ): Promise<TransactionPaginatedResponseDTO> => {
    const userId = userIdOverride ?? getCurrentUserId()
    const ref = collection(db, COLLECTION_NAME)
    const constraints: ReturnType<typeof where>[] = [where('userId', '==', userId)]

    if (filters?.selectedDate) {
      const dueDay = filters.billingDueDay
      const useBillingCycle = dueDay != null
      const { start, end } = useBillingCycle
        ? getBillingCycleRange(filters.selectedDate, dueDay)
        : getMonthRange(filters.selectedDate)

      constraints.push(where('date', '>=', start))
      constraints.push(
        where('date', useBillingCycle ? '<=' : '<', end)
      )
    }

    const q = query(ref, ...constraints)
    const snapshot = await getDocs(q)

    let items: RawItem[] = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as RawItem[]

    items = applyFilters(items, filters)
    items = applySort(items, sort)

    const totalCount = items.length
    const totalIncome = items
      .filter(t => t.type === 1)
      .reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = items
      .filter(t => t.type === 2)
      .reduce((sum, t) => sum + t.amount, 0)

    const page = paginate?.page || 0
    const size = paginate?.size || 20
    const start = page * size
    const paged = items.slice(start, start + size).map(toDto)

    return { items: paged, totalCount, totalIncome, totalExpense }
  },

  getManyByIds: async (
    ids: string[]
  ): Promise<Map<string, { date: string; description: string }>> => {
    const uniqueIds = [...new Set(ids)]
    const entries = await Promise.all(
      uniqueIds.map(async id => {
        const docRef = doc(db, COLLECTION_NAME, id)
        const snap = await getDoc(docRef)
        if (!snap.exists()) return [id, null] as const
        const data = snap.data() as { date: string; description: string }
        return [id, { date: data.date, description: data.description ?? '' }] as const
      })
    )
    const map = new Map<string, { date: string; description: string }>()
    for (const [id, value] of entries) {
      if (value) map.set(id, value)
    }
    return map
  },

  readManyFiltered: async (
    filters?: FiltersDTO,
    sort?: SortDTO
  ): Promise<TransactionPaginatedResponseDTO> => {
    const userId = getCurrentUserId()
    const ref = collection(db, COLLECTION_NAME)
    const constraints: ReturnType<typeof where>[] = [where('userId', '==', userId)]

    if (filters?.selectedDate) {
      const dueDay = filters.billingDueDay
      const useBillingCycle = dueDay != null
      const { start, end } = useBillingCycle
        ? getBillingCycleRange(filters.selectedDate, dueDay)
        : getMonthRange(filters.selectedDate)
      constraints.push(where('date', '>=', start))
      constraints.push(
        where('date', useBillingCycle ? '<=' : '<', end)
      )
    }

    const q = query(ref, ...constraints)
    const snapshot = await getDocs(q)

    let items: RawItem[] = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as RawItem[]

    items = applyFilters(items, filters)
    items = applySort(items, sort)

    const totalCount = items.length
    const totalIncome = items
      .filter(t => t.type === 1)
      .reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = items
      .filter(t => t.type === 2)
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      items: items.map(toDto),
      totalCount,
      totalIncome,
      totalExpense
    }
  },

  /**
   * Returns all credit-card transactions with id, description and category
   * for reprocessing classifications (re-apply rules to existing data).
   */
  getAllForRecategorize: async (): Promise<
    { id: string; description: string; category: number }[]
  > => {
    const userId = getCurrentUserId()
    const ref = collection(db, COLLECTION_NAME)
    const q = query(ref, where('userId', '==', userId), where('source', '==', CREDIT_CARD_SOURCE))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => {
      const data = d.data() as RawItem
      return {
        id: d.id,
        description: data.description ?? '',
        category: data.category
      }
    })
  }
}
