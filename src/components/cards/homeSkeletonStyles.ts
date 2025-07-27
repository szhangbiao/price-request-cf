// HomeSkeleton 组件的样式
export const homeSkeletonStyles = `
  .home-skeleton {
    padding: 24px;
    background: white;
    border-radius: 8px;
    border: 1px solid #e5e5e5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  /* 暗色主题 */
  body.dark-theme .home-skeleton {
    background: #1e1e1e;
    border-color: #333;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  /* 脉冲动画 */
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* 骨架屏元素样式 */
  .skeleton-title {
    height: 32px;
    width: 33.333333%;
    background-color: #e5e7eb;
    border-radius: 4px;
    margin-bottom: 24px;
  }

  body.dark-theme .skeleton-title {
    background-color: #374151;
  }

  .skeleton-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .skeleton-item {
    height: 64px;
    width: 100%;
    background-color: #e5e7eb;
    border-radius: 4px;
  }

  body.dark-theme .skeleton-item {
    background-color: #374151;
  }

  .skeleton-buttons {
    margin-top: 32px;
    display: flex;
    gap: 16px;
  }

  .skeleton-button {
    height: 40px;
    width: 96px;
    background-color: #e5e7eb;
    border-radius: 4px;
  }

  body.dark-theme .skeleton-button {
    background-color: #374151;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .home-skeleton {
      padding: 16px;
      margin: 10px;
    }
    
    .skeleton-buttons {
      flex-direction: column;
      gap: 12px;
    }
    
    .skeleton-button {
      width: 100%;
    }
  }
`;