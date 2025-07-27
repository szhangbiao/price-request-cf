// ErrorMessage 组件的样式
export const errorMessageStyles = `
  .error-container {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    border: 2px solid #f87171;
    border-radius: 12px;
    padding: 24px;
    margin: 20px 0;
    box-shadow: 0 4px 12px rgba(248, 113, 113, 0.15);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .error-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ef4444, #dc2626, #b91c1c);
    animation: errorPulse 2s ease-in-out infinite;
  }

  @keyframes errorPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  .error-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    gap: 12px;
  }

  .error-icon {
    font-size: 24px;
    color: #dc2626;
    animation: shake 0.5s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  .error-title {
    color: #991b1b;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .error-message {
    color: #7f1d1d;
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
    background: rgba(255, 255, 255, 0.5);
    padding: 12px 16px;
    border-radius: 8px;
    border-left: 4px solid #dc2626;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }

  .error-actions {
    margin-top: 16px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .error-button {
    background: #dc2626;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .error-button:hover {
    background: #b91c1c;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
  }

  .error-button:active {
    transform: translateY(0);
  }

  .error-button.secondary {
    background: transparent;
    color: #dc2626;
    border: 1px solid #dc2626;
  }

  .error-button.secondary:hover {
    background: #dc2626;
    color: white;
  }

  /* 暗色主题 */
  body.dark-theme .error-container {
    background: linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%);
    border-color: #dc2626;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
  }

  body.dark-theme .error-title {
    color: #fca5a5;
  }

  body.dark-theme .error-message {
    color: #fecaca;
    background: rgba(0, 0, 0, 0.3);
  }

  body.dark-theme .error-button.secondary {
    color: #fca5a5;
    border-color: #fca5a5;
  }

  body.dark-theme .error-button.secondary:hover {
    background: #dc2626;
    color: white;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .error-container {
      margin: 16px 10px;
      padding: 20px;
    }
    
    .error-actions {
      flex-direction: column;
    }
    
    .error-button {
      justify-content: center;
    }
  }
`;