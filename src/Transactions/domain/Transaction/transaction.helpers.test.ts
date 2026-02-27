const mockSetQueryData = jest.fn()

jest.mock('@/app', () => ({
  queryClient: {
    setQueryData: (...args: unknown[]) => mockSetQueryData(...args),
  },
}))

import { updatePaginatedQuery } from './transaction.helpers'
import type { Transaction } from './transaction.entity'

describe('updatePaginatedQuery', () => {
  beforeEach(() => {
    mockSetQueryData.mockClear()
  })

  it('updates the matching item in paginated cache', () => {
    const queryKey = ['transactions']
    const mockTransaction = {
      id: 'tx1',
      date: '2025-01-15',
      description: 'Store',
      amount: 100,
      type: { id: 'expense' },
      category: { id: 'cat1' },
    } as unknown as Transaction

    const oldData = {
      pages: [
        {
          items: [
            { id: 'tx0', date: '2025-01-01', description: 'A', amount: 50, type: 'expense', category: 'c0' },
            { id: 'tx1', date: '2025-01-15', description: 'Old', amount: 99, type: 'expense', category: 'c0' },
          ],
          totalCount: 2,
          totalIncome: 0,
          totalExpense: 149,
        },
      ],
      pageParams: [0],
    }

    updatePaginatedQuery(mockTransaction, queryKey)

    expect(mockSetQueryData).toHaveBeenCalledWith(queryKey, expect.any(Function))
    const updater = mockSetQueryData.mock.calls[0][1]
    const result = updater(oldData)
    expect(result).toBeDefined()
    expect(result!.pages[0].items[1]).toEqual({
      id: 'tx1',
      date: '2025-01-15',
      description: 'Store',
      amount: 100,
      type: 'expense',
      category: 'cat1',
    })
  })

  it('does not mutate when oldData is undefined', () => {
    const queryKey = ['transactions']
    const mockTransaction = {
      id: 'tx1',
      date: '2025-01-15',
      description: 'D',
      amount: 100,
      type: { id: 'income' },
      category: { id: 'cat1' },
    } as unknown as Transaction

    updatePaginatedQuery(mockTransaction, queryKey)

    const updater = mockSetQueryData.mock.calls[0][1]
    const result = updater(undefined)
    expect(result).toBeUndefined()
  })
})
