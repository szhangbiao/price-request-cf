// Footer 组件的样式
export const footerStyles = `
  footer {
    background: #2c3e50;
    color: #ecf0f1;
    text-align: center;
    padding: 30px 20px;
    margin-top: auto;
    font-size: 0.9rem;
    border-top: 1px solid #34495e;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  /* 暗色主题 footer */
  body.dark-theme footer {
    background: #0d1117;
    color: #c9d1d9;
    border-top-color: #21262d;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  }
  
  footer p {
    margin: 0;
    font-weight: 400;
    letter-spacing: 0.5px;
  }
  
  footer .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  footer .footer-links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-bottom: 10px;
  }
  
  footer .footer-links a {
    color: #bdc3c7;
    text-decoration: none;
    font-size: 0.85rem;
    padding: 5px 10px;
    border-radius: 4px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    height: 32px;
  }
  
  footer .footer-links a:hover {
    color: #3498db;
    background: rgba(52, 152, 219, 0.1);
  }
  
  /* 暗色主题 footer 链接 */
  body.dark-theme footer .footer-links a {
    color: #8b949e;
  }
  
  body.dark-theme footer .footer-links a:hover {
    color: #58a6ff;
    background: rgba(88, 166, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    footer {
      padding: 20px 15px;
    }
    
    footer .footer-links {
      flex-direction: column;
      gap: 10px;
      text-align: center;
    }
    
    footer .footer-links a {
      justify-content: center;
    }
  }
`;