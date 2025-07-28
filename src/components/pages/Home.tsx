import type { FC } from 'hono/jsx'
import type { PriceData } from '../../types/price'
import { ExchangeRateCard, GoldCard, StocksCard, HomeSkeleton } from '../cards';
import Header from './Header'
import ErrorMessage from './ErrorMessage'
import { homeStyles } from './homeStyles'
import { formatTime } from '../../utils/timeUtils'

interface HomeProps {
  priceData?: PriceData | null;
  error?: string;
  showSkeleton?: boolean;
}

const Home: FC<HomeProps> = ({ priceData, error, showSkeleton = false }) => {
  return (
    <div class="home-container">
      <style>{homeStyles}</style>

      <Header />
      {/* 显示错误信息 */}
      {error && <ErrorMessage error={error} />}

      {/* 显示骨架屏 */}
      {showSkeleton && <HomeSkeleton />}

      {/* 显示真实数据 */}
      {priceData && !showSkeleton && (
        <div class="price-dashboard">
          <div class="price-grid">
            {priceData.gold && <GoldCard gold={priceData.gold} />}
            {priceData.exchangeRate && <ExchangeRateCard exchangeRate={priceData.exchangeRate} />}
            {priceData.stocks && priceData.stocks.length > 0 && <StocksCard stocks={priceData.stocks} />}
          </div>

          <div class="data-source">
            <div class="source-info">
              <span class="source-label">数据来源:</span>
              <span class={`source-value ${priceData.source}`}>{priceData.source}</span>
            </div>
            <div class="update-time">
              <span class="time-label">最后更新</span>
              <span class="time-value">{formatTime(priceData.updateTime)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home