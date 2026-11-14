import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, BookOpen } from 'lucide-react';
import { router } from '../../router/router';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught a runtime error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    router.navigate('library');
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl p-8 max-w-lg mx-auto my-8 text-center space-y-4 shadow-md font-sans">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-bold text-lg text-[var(--text-main)]">
              {this.props.fallbackTitle || 'Something went wrong'}
            </h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-sm mx-auto">
              {this.props.fallbackMessage || "We couldn't load this section properly."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 bg-[var(--gold)] hover:bg-[var(--gold-light)] text-black font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              className="px-4 py-2 bg-[var(--bg-main)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] border border-[var(--border-main)] font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Back to Library</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
