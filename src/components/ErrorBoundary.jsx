import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, fontFamily: 'monospace', maxWidth: 600, margin: '40px auto' }}>
          <h1 style={{ color: '#e11d48', fontSize: 24 }}>Something went wrong</h1>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#dc2626', background: '#fef2f2', padding: 16, borderRadius: 8, marginTop: 16, fontSize: 13 }}>
            {this.state.error?.toString()}
          </pre>
          {this.state.errorInfo && (
            <pre style={{ whiteSpace: 'pre-wrap', color: '#92400e', background: '#fffbeb', padding: 16, borderRadius: 8, marginTop: 12, fontSize: 11, maxHeight: 300, overflow: 'auto' }}>
              {this.state.errorInfo.componentStack}
            </pre>
          )}
          <button onClick={() => { this.setState({ hasError: false, error: null, errorInfo: null }); window.location.reload(); }} style={{ marginTop: 16, padding: '8px 20px', background: '#14b8a6', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
