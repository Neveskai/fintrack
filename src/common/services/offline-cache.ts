const DB_NAME = 'financas-offline'
const DB_VERSION = 1
const STORE_NAME = 'cache'

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const OfflineCache = {
  async get<T>(key: string): Promise<T | null> {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const request = store.get(key)

      request.onsuccess = () => {
        const result = request.result
        if (!result) return resolve(null)

        const { data, expiresAt } = result
        if (expiresAt && Date.now() > expiresAt) {
          OfflineCache.remove(key)
          return resolve(null)
        }
        resolve(data as T)
      }
      request.onerror = () => reject(request.error)
    })
  },

  async set<T>(key: string, data: T, ttlMs = 24 * 60 * 60 * 1000): Promise<void> {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      store.put({ data, expiresAt: Date.now() + ttlMs }, key)

      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  },

  async remove(key: string): Promise<void> {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      store.delete(key)

      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  },

  async clear(): Promise<void> {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      store.clear()

      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }
}
