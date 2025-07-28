// 共享的卡片样式
export const cardStyles = `
  .price-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    border-left: 4px solid;
    transition: all 0.3s ease;
  }

  /* 暗色主题卡片 */
  body.dark-theme .price-card {
    background: #1e1e1e;
    color: #e0e0e0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  }

  .gold-card {
    border-left-color: #f39c12;
  }

  .gold-price {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
  }
  .gold-price .percent {
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 14px;
  }

  .exchange-card {
    border-left-color: #3498db;
  }

  .stocks-card {
    border-left-color: #e74c3c;
  }

  .price-card h3 {
    margin: 0 0 15px 0;
    font-size: 1.2rem;
    color: #333;
    font-weight: 600;
    transition: color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .price-card h3 i {
    font-size: 1.1rem;
    opacity: 0.8;
  }

  /* 暗色主题标题 */
  body.dark-theme .price-card h3 {
    color: #e0e0e0;
  }

  .price-info {
    display: flex;
    flex-direction: column;
  }

  .main-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ecf0f1;
    transition: border-color 0.3s ease;
  }

  /* 暗色主题主价格边框 */
  body.dark-theme .main-price {
    border-bottom-color: #404040;
  }

  .main-price .label {
    font-weight: bold;
    color: #7f8c8d;
    transition: color 0.3s ease;
  }

  /* 暗色主题标签 */
  body.dark-theme .main-price .label {
    color: #b0b0b0;
  }

  .main-price .value {
    font-size: 24px;
    font-weight: bold;
    color: #2c3e50;
    transition: color 0.3s ease;
  }

  /* 暗色主题值 */
  body.dark-theme .main-price .value {
    color: #e0e0e0;
  }

  .price-details, .exchange-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 15px;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
  }

  .detail-item .label {
    color: #7f8c8d;
    font-size: 14px;
    transition: color 0.3s ease;
  }

  .detail-item .value {
    font-weight: bold;
    color: #2c3e50;
    transition: color 0.3s ease;
  }

  /* 暗色主题详情项目 */
  body.dark-theme .detail-item .label {
    color: #b0b0b0;
  }

  body.dark-theme .detail-item .value {
    color: #e0e0e0;
  }

  .update-time {
    color: #6c757d;
    font-size: 14px;
    transition: color 0.3s ease;
  }

  /* 暗色主题更新时间 */
  body.dark-theme .update-time {
    color: #a0a0a0;
  }

  .stocks-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .stock-item {
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border-left: 3px solid #e74c3c;
    transition: all 0.3s ease;
  }

  /* 暗色主题股票项目 */
  body.dark-theme .stock-item {
    background-color: #2d2d2d;
    border-left-color: #e74c3c;
  }

  .stock-name {
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 8px;
    transition: color 0.3s ease;
  }

  /* 暗色主题股票名称 */
  body.dark-theme .stock-name {
    color: #e0e0e0;
  }

  .stock-price {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px;
  }

  .stock-price .current {
    font-size: 18px;
    font-weight: bold;
    color: #2c3e50;
    transition: color 0.3s ease;
  }

  /* 暗色主题股票当前价格 */
  body.dark-theme .stock-price .current {
    color: #e0e0e0;
  }

  .stock-price .change, .stock-price .percent {
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 14px;
  }

  .positive {
    background-color: #f8d7da;
    color: #721c24;
  }

  .negative {
    background-color: #d4edda;
    color: #155724;
  }

  /* 暗色主题涨跌颜色 */
  body.dark-theme .positive {
    background-color: #4d1e1e;
    color: #f87171;
  }

  body.dark-theme .negative {
    background-color: #1e4d2b;
    color: #4ade80;
  }

  .stock-volume {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  .stock-volume .label {
    color: #7f8c8d;
    transition: color 0.3s ease;
  }

  .stock-volume .value {
    color: #495057;
    transition: color 0.3s ease;
  }

  /* 暗色主题成交量 */
  body.dark-theme .stock-volume .label {
    color: #b0b0b0;
  }

  body.dark-theme .stock-volume .value {
    color: #d0d0d0;
  }

  .change-info {
    margin-top: 15px;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 6px;
    transition: all 0.3s ease;
  }

  /* 暗色主题变化信息 */
  body.dark-theme .change-info {
    background: #2d2d2d;
  }

  @media (max-width: 768px) {
    .price-details, .exchange-details {
      grid-template-columns: 1fr;
    }
  }
`;