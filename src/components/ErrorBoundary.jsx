import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Очищаем localStorage на случай, если ошибка вызвана поврежденными данными
    if (this.props.clearStorage) {
      localStorage.clear();
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h1>Упс! Что-то пошло не так</h1>
            <p>Приложение столкнулось с неожиданной ошибкой.</p>

            <div className="error-actions">
              <button onClick={this.handleReset} className="error-btn primary">
                Попробовать снова
              </button>
              <button
                onClick={() => {
                  this.props.clearStorage = true;
                  this.handleReset();
                }}
                className="error-btn secondary"
              >
                Сбросить настройки и перезагрузить
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Детали ошибки (для разработки)</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
