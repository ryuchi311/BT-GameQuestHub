
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Enable detailed React logging
console.log('🚀 Starting React application...');

// Add error boundary for better debugging
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('🛑 React Error Boundary caught error:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('🛑 React Error Details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{padding: '20px', background: '#fee', color: '#c00'}}>
        <h2>Something went wrong!</h2>
        <p>Check the console for details.</p>
      </div>;
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
    console.log('📦 Root element found, creating React root...');
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </React.StrictMode>
    );
    console.log('✅ React app rendered successfully');
} else {
    console.error('❌ Root element not found!');
}
