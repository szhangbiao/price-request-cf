// Home 组件的样式
export const homeStyles = `
  .home-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: transparent;
  }

  .error-message, .loading-message {
    text-align: center;
    padding: 40px 20px;
    margin: 20px 0;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  /* 暗色主题错误和加载消息 */
  body.dark-theme .error-message,
  body.dark-theme .loading-message {
    background: #1e1e1e;
    color: #e0e0e0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  .error-message {
    background: #fee;
    color: #c33;
    border: 1px solid #fcc;
    transition: all 0.3s ease;
  }

  /* 暗色主题错误消息 */
  body.dark-theme .error-message {
    background: #2d1b1b;
    color: #ff6b6b;
    border-color: #4a2626;
  }

  .loading-message {
    background: #e3f2fd;
    color: #1976d2;
    border: 1px solid #bbdefb;
    transition: all 0.3s ease;
  }

  /* 暗色主题加载消息 */
  body.dark-theme .loading-message {
    background: #1a2332;
    color: #64b5f6;
    border-color: #2d3748;
  }

  .error-message h3, .loading-message h3 {
    margin: 0 0 10px 0;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .error-message p, .loading-message p {
    margin: 0;
    font-size: 1rem;
    opacity: 0.9;
  }

  .price-dashboard {
    margin-top: 30px;
  }

  .price-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 25px;
    margin-bottom: 40px;
  }

  .data-source {
    background: white;
    color: #333;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    border: 1px solid #e5e5e5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    transition: all 0.3s ease;
  }

  /* 暗色主题数据来源 */
  body.dark-theme .data-source {
    background: #1e1e1e;
    color: #e0e0e0;
    border-color: #333;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .source-info {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .source-label {
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  /* 暗色主题标签 */
  body.dark-theme .source-label {
    color: #b0b0b0;
  }

  .source-value {
    font-size: 1.1rem;
    font-weight: 600;
    padding: 8px 16px;
    background: #f8f9fa;
    color: #333;
    border-radius: 20px;
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;
  }

  /* 暗色主题值 */
  body.dark-theme .source-value {
    background: #2d2d2d;
    color: #e0e0e0;
    border-color: #404040;
  }

  .update-time {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    font-size: 0.85rem;
    color: #666;
    transition: color 0.3s ease;
  }

  /* 暗色主题更新时间 */
  body.dark-theme .update-time {
    color: #b0b0b0;
  }

  .time-label {
    font-weight: 500;
  }

  .time-value {
    font-weight: 600;
    background: #f8f9fa;
    color: #333;
    padding: 4px 12px;
    border-radius: 12px;
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;
  }

  /* 暗色主题时间值 */
  body.dark-theme .time-value {
    background: #2d2d2d;
    color: #e0e0e0;
    border-color: #404040;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .home-container {
      padding: 15px;
    }

    .price-grid {
      grid-template-columns: 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }

    .data-source {
      padding: 15px;
      gap: 12px;
      flex-direction: column;
      justify-content: center;
    }

    .error-message, .loading-message {
      padding: 30px 15px;
    }
  }

  @media (max-width: 480px) {
    .home-container {
      padding: 10px;
    }

    .price-grid {
      gap: 15px;
      margin-bottom: 25px;
    }

    .data-source {
      padding: 12px;
      gap: 10px;
      flex-direction: column;
      justify-content: center;
    }

    .source-value {
      font-size: 1rem;
      padding: 6px 12px;
    }

    .update-time {
      font-size: 0.8rem;
    }
  }
`;