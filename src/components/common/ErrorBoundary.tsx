import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', backgroundColor: '#0f172a', color: '#f1f5f9', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '1rem' }}>Aplica&ccedil;&atilde;o Crashou (Erro Fatal)</h1>
          <p style={{ marginBottom: '1rem' }}>Por favor tire um print screen (captura de ecr&atilde;) desta p&aacute;gina e envie-me para eu corrigir de imediato:</p>
          <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', marginBottom: '1rem' }}>
            <strong style={{ color: '#f87171' }}>{this.state.error?.toString()}</strong>
            <br />
            <br />
            <pre style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {this.state.errorInfo?.componentStack}
            </pre>
          </div>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/'; }} 
            style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
          >
            Limpar Cache e Recarregar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
