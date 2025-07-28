import type { FC } from 'hono/jsx'
import type { GoldData } from '../../types/price'
import { cardStyles } from './cardStyles'

interface GoldCardProps {
  gold: GoldData;
}

const GoldCard: FC<GoldCardProps> = ({ gold }) => {
  // 格式化数字显示
  const formatNumber = (num: number | string): string => {
    const value = typeof num === 'string' ? parseFloat(num) : num;
    return isNaN(value) ? '0.00' : value.toFixed(2);
  };

  // 判断涨跌幅是正数还是负数
  const isPositive = () => {
    if (!gold.limit) return false;
    return !gold.limit.includes('-');
  };

  return (
    <div class="price-card gold-card">
      <style>{cardStyles}</style>

      <h3><i class="fas fa-coins"></i> 黄金价格 ({gold.variety})</h3>
      <div class="price-info">
        <div class="main-price">
          <span class="label">最新价:</span>
          <div  class="gold-price">
            <span class="value">¥ {formatNumber(gold.latestpri)}</span>
                {gold.limit && (
                    <span class={`percent ${isPositive() ? 'positive' : 'negative'}`}>
                    {gold.limit}
                    </span>
                )}
            </div>
        </div>
        <div class="price-details">
          <div class="detail-item">
            <span class="label">开盘价:</span>
            <span class="value">¥{formatNumber(gold.openpri)}</span>
          </div>
          <div class="detail-item">
            <span class="label">最高价:</span>
            <span class="value">¥{formatNumber(gold.maxpri)}</span>
          </div>
          <div class="detail-item">
            <span class="label">最低价:</span>
            <span class="value">¥{formatNumber(gold.minpri)}</span>
          </div>
          <div class="detail-item">
            <span class="label">昨收价:</span>
            <span class="value">¥{formatNumber(gold.yespri)}</span>
          </div>
        </div>
        <div class="update-time">更新时间: {gold.time}</div>
      </div>
    </div>
  );
};

export default GoldCard;