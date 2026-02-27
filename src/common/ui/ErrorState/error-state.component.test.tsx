jest.mock('firebase/auth', () => ({
  onAuthStateChanged: () => () => {},
  signOut: () => Promise.resolve(),
}))
jest.mock('@/common/services/Firebase', () => ({ auth: {} }))

import { render, screen, userEvent } from '@/test-utils'
import { ErrorState } from './error-state.component'

describe('ErrorState', () => {
  it('renders default title and description', () => {
    render(<ErrorState />)
    expect(screen.getByText('Algo deu errado')).toBeInTheDocument()
    expect(screen.getByText('Não foi possível carregar. Tente novamente.')).toBeInTheDocument()
  })

  it('renders custom title and description', () => {
    render(
      <ErrorState title="Erro customizado" description="Descrição customizada" />
    )
    expect(screen.getByText('Erro customizado')).toBeInTheDocument()
    expect(screen.getByText('Descrição customizada')).toBeInTheDocument()
  })

  it('shows retry button when onRetry is provided', async () => {
    const onRetry = jest.fn()
    render(<ErrorState onRetry={onRetry} />)
    const button = screen.getByRole('button', { name: /tentar novamente/i })
    expect(button).toBeInTheDocument()
    await userEvent.click(button)
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('does not show retry button when onRetry is not provided', () => {
    render(<ErrorState />)
    expect(screen.queryByRole('button', { name: /tentar novamente/i })).not.toBeInTheDocument()
  })
})
