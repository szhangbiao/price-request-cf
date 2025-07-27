// Header 组件的样式
export const headerStyles = `
  .page-header {
    text-align: center;
    margin-bottom: 40px;
    padding: 40px 20px;
    background: white;
    color: #333;
    border-radius: 8px;
    border: 1px solid #e5e5e5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  /* 暗色主题 Header */
  body.dark-theme .page-header {
    background: #1e1e1e;
    color: #e0e0e0;
    border-color: #333;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .header-title {
    margin: 0 0 15px 0;
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    transition: color 0.3s ease;
  }

  /* 暗色主题标题 */
  body.dark-theme .header-title {
    color: #e0e0e0;
  }

  .header-subtitle {
    margin: 0;
    font-size: 1.2rem;
    color: #666;
    font-weight: 400;
    transition: color 0.3s ease;
  }

  /* 暗色主题副标题 */
  body.dark-theme .header-subtitle {
    color: #b0b0b0;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .page-header {
      padding: 30px 15px;
      margin-bottom: 30px;
    }

    .header-title {
      font-size: 2rem;
    }

    .header-subtitle {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .page-header {
      padding: 25px 10px;
    }

    .header-title {
      font-size: 1.8rem;
    }

    .header-subtitle {
      font-size: 0.9rem;
    }
  }
`;