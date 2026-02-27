import { Transaction } from '@/Transactions/domain/Transaction'
import { create } from 'zustand'
import { CategoryEnum } from '@/Transactions/common/enums'

export type EditFormType = {
  category: CategoryEnum
}

interface EditTransactionState {
  open: boolean
  editForm: EditFormType | null
  transaction: Transaction | null
  onChange: (key: keyof EditFormType, value: unknown) => void
  openDialog: (transaction: Transaction) => void
  toggleDialog: () => void
  persistChanges: () => void
}

export const useEditFormStore = create<EditTransactionState>((set, get) => ({
  open: false,
  transaction: null,
  editForm: null,

  toggleDialog() {
    const { open } = get()

    set({ open: !open })
  },

  openDialog(transaction: Transaction) {
    set({
      open: true,
      transaction,
      editForm: transaction.editInitialFormState
    })
  },

  onChange(key, value) {
    const { editForm } = get()

    set({
      editForm: { ...editForm, [key]: value } as EditFormType
    })
  },

  persistChanges() {
    const { editForm, transaction } = get()
    if (transaction && editForm) transaction.updateFields(editForm)
  }
}))
