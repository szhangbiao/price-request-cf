export const layoutStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f8f9fa;
    min-height: 100vh;
    transition: all 0.3s ease;
  }
  
  /* 暗色主题全局样式 */
  body.dark-theme {
    background: #121212;
    color: #e0e0e0;
  }
  
  main {
    min-height: calc(100vh - 140px);
  }
`;