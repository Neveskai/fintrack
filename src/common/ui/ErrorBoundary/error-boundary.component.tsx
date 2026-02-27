import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorState } from '../ErrorState'

export type ErrorBoundaryProps = {
  children: ReactNode
  title?: string
  description?: string
  fallback?: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <ErrorState
          title={this.props.title}
          description={this.props.description}
          onRetry={this.handleRetry}
        />
      )
    }
    return this.props.children
  }
}
