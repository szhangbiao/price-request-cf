import type { FC } from 'hono/jsx'
import type { StockData } from '../../types/price'
import { cardStyles } from './cardStyles'

interface StocksCardProps {
  stocks: StockData[];
}

const StocksCard: FC<StocksCardProps> = ({ stocks }) => {
  // 格式化数字显示
  const formatNumber = (num: number): string => {
    return num.toFixed(2);
  };

  // 格式化百分比显示
  const formatPercent = (num: number): string => {
    return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  return (
    <div class="price-card stocks-card">
      <style>{cardStyles}</style>

      <h3><i class="fas fa-chart-line"></i> 股票指数</h3>
      <div class="stocks-list">
        {stocks.map((stock, index) => (
          <div key={index} class="stock-item">
            <div class="stock-name">{stock.name}</div>
            <div class="stock-price">
              <span class="current">{formatNumber(stock.current)}</span>
              <span class={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                {stock.change >= 0 ? '+' : ''}{formatNumber(stock.change)}
              </span>
              <span class={`percent ${stock.percent >= 0 ? 'positive' : 'negative'}`}>
                {formatPercent(stock.percent)}
              </span>
            </div>
            <div class="stock-volume">
              <span class="label">成交量:</span>
              <span class="value">{stock.volume.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StocksCard;