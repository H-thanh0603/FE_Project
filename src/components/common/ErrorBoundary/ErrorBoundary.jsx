import { Component } from 'react';
import { Link } from 'react-router-dom';
import './ErrorBoundary.css';

function isChunkLoadError(error) {
  const message = String(error?.message || '');
  return (
    error?.name === 'ChunkLoadError' ||
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('Importing a module script failed')
  );
}

/**
 * Bắt lỗi runtime và lỗi tải lazy chunk trong nhánh trang con.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleRetry = () => {
    if (isChunkLoadError(this.state.error)) {
      window.location.reload();
      return;
    }
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const chunkFailed = isChunkLoadError(this.state.error);

    return (
      <div className="container">
        <div className="page error-boundary" role="alert">
          <span className="icon error-boundary-icon">error</span>
          <h1 className="section-title">
            {chunkFailed ? 'Không thể tải nội dung trang' : 'Đã xảy ra sự cố ngoài ý muốn'}
          </h1>
          <p className="error-boundary-desc">
            {chunkFailed
              ? 'Kết nối mạng bị gián đoạn hoặc phiên bản trang đã được cập nhật. Hãy tải lại để tiếp tục.'
              : 'Trang gặp lỗi khi hiển thị. Bạn có thể thử lại hoặc quay về trang chủ.'}
          </p>
          <div className="error-boundary-actions">
            <button type="button" className="btn btn--dark" onClick={this.handleRetry}>
              {chunkFailed ? 'Tải lại trang' : 'Thử lại'}
            </button>
            <Link
              to="/"
              className="btn btn--light"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
