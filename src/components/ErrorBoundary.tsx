import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.origin + '/';
  };

  private handleClearAndReload = () => {
    try {
      localStorage.removeItem('cetep_user');
      sessionStorage.clear();
    } catch (e) {}
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.origin + '/';
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-100">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Recuperação de Sessão
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
              Houve uma instabilidade temporária ao carregar a página. Escolha uma das opções abaixo para continuar:
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleGoHome}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
              >
                <Home className="w-4 h-4" /> Ir para a Página Inicial
              </button>

              <button
                onClick={this.handleRetry}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Recarregar Página
              </button>

              <button
                onClick={this.handleClearAndReload}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-rose-100"
              >
                <Trash2 className="w-3.5 h-3.5" /> Limpar Cache e Reiniciar
              </button>
            </div>

            {this.state.error && (
              <details className="mt-6 text-left border-t border-slate-100 pt-4">
                <summary className="text-[10px] font-bold text-slate-400 cursor-pointer uppercase tracking-wider">
                  Detalhes técnicos do erro
                </summary>
                <p className="mt-2 text-[11px] font-mono text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100 overflow-x-auto break-all">
                  {this.state.error.message || String(this.state.error)}
                </p>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
