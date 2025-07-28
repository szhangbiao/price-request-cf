// About 组件的样式
export const aboutStyles = `
  .about-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: transparent;
  }

  .about-content {
    background: white;
    color: #333;
    padding: 40px;
    border-radius: 8px;
    border: 1px solid #e5e5e5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-top: 30px;
    transition: all 0.3s ease;
  }

  /* 暗色主题内容区域 */
  body.dark-theme .about-content {
    background: #1e1e1e;
    color: #e0e0e0;
    border-color: #333;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .about-title {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 20px;
    color: #333;
    transition: color 0.3s ease;
  }

  /* 暗色主题标题 */
  body.dark-theme .about-title {
    color: #e0e0e0;
  }

  .about-description {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #555;
    margin-bottom: 30px;
    transition: color 0.3s ease;
  }

  /* 暗色主题描述文本 */
  body.dark-theme .about-description {
    color: #b0b0b0;
  }

  .feature-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 30px;
  }

  .feature-item {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;
  }

  /* 暗色主题功能项 */
  body.dark-theme .feature-item {
    background: #2d2d2d;
    border-color: #404040;
  }

  .feature-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 10px;
    color: #333;
    transition: color 0.3s ease;
  }

  /* 暗色主题功能标题 */
  body.dark-theme .feature-title {
    color: #e0e0e0;
  }

  .feature-description {
    font-size: 1rem;
    color: #666;
    line-height: 1.5;
    transition: color 0.3s ease;
  }

  /* 暗色主题功能描述 */
  body.dark-theme .feature-description {
    color: #b0b0b0;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .about-container {
      padding: 15px;
    }

    .about-content {
      padding: 30px 20px;
      margin-top: 20px;
    }

    .feature-list {
      grid-template-columns: 1fr;
      gap: 15px;
    }
  }

  @media (max-width: 480px) {
    .about-container {
      padding: 10px;
    }

    .about-content {
      padding: 20px 15px;
      margin-top: 15px;
    }

    .about-title {
      font-size: 1.5rem;
    }

    .about-description {
      font-size: 1rem;
    }
  }
`;