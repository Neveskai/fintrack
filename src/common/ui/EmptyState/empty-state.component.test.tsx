jest.mock('firebase/auth', () => ({
  onAuthStateChanged: () => () => {},
  signOut: () => Promise.resolve(),
}))
jest.mock('@/common/services/Firebase', () => ({ auth: {} }))

import { render, screen } from '@/test-utils'
import { EmptyState } from './empty-state.component'

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="Nenhum item" />)
    expect(screen.getByText('Nenhum item')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(
      <EmptyState title="Título" description="Descrição opcional" />
    )
    expect(screen.getByText('Descrição opcional')).toBeInTheDocument()
  })

  it('renders action when provided', () => {
    render(
      <EmptyState
        title="Título"
        action={<button type="button">Adicionar</button>}
      />
    )
    expect(screen.getByRole('button', { name: 'Adicionar' })).toBeInTheDocument()
  })
})
