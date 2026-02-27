import { Transaction } from '@/Transactions/domain/Transaction'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import { BubbleMenuItem } from '@/Transactions/common/ui'

const grayCSS = (resolvedTheme?: string) => ({
  fontSize: 13,
  minW: '92px',
  color: resolvedTheme === 'light' ? 'gray.600' : 'gray.300',
  _hover: {
    color: resolvedTheme === 'light' ? 'gray.700' : 'gray.200',
    bg: resolvedTheme === 'light' ? 'gray.100' : 'gray.900'
  }
})

export const menuItems = (
  resolvedTheme: string | undefined,
  transaction: Transaction,
  openDialog: (transaction: Transaction) => void
) => {
  const HItems = [
    {
      label: 'Editar',
      value: 'edit',
      onClick: () => openDialog(transaction),
      icon: <LuPencil strokeWidth={2.5} />,
      css: grayCSS(resolvedTheme)
    }
  ]

  const VItems: BubbleMenuItem[] = [
    {
      label: 'Excluir',
      value: 'delete',
      onClick: () => transaction.remove(),
      icon: <LuTrash2 strokeWidth={2.5} />,
      css: {
        fontSize: 13,
        fontWeight: 600,
        color: resolvedTheme === 'light' ? 'red.600' : 'red.400',
        _hover: {
          color: resolvedTheme === 'light' ? 'red.700' : 'red.300',
          bg: resolvedTheme === 'light' ? 'red.100' : 'red.900'
        }
      }
    }
  ]

  return { VItems, HItems }
}
