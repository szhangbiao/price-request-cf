import type { FC } from 'hono/jsx'

interface ErrorMessageProps {
  error: string;
  title?: string;
  showActions?: boolean;
  onRetry?: () => void;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ 
  error, 
  title = "获取数据失败",
  showActions = true,
  onRetry 
}) => {
  return (
    <div class="error-container">
      
      <div class="error-header">
        <div class="error-icon">❌</div>
        <h3 class="error-title">{title}</h3>
      </div>
      
      <div class="error-message">
        {error}
      </div>
      
      {showActions && (
        <div class="error-actions">
          <button 
            class="error-button" 
            onclick="window.location.reload()"
          >
            <i class="fas fa-redo"></i>
            重新加载
          </button>
          <a 
            href="/api/health" 
            class="error-button secondary"
            target="_blank"
          >
            <i class="fas fa-heartbeat"></i>
            检查服务状态
          </a>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;