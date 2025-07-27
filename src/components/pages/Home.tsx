import type { FC } from 'hono/jsx'
import type { PriceData } from '../../types/price'
import GoldCard from '../cards/GoldCard'
import ExchangeRateCard from '../cards/ExchangeRateCard'
import StocksCard from '../cards/StocksCard'
import Header from './Header'
import { homeStyles } from './homeStyles'
import { formatTime } from '../../utils/timeUtils'

interface HomeProps {
  priceData?: PriceData | null;
  error?: string;
}

const Home: FC<HomeProps> = ({ priceData, error }) => {
  return (
    <div class="home-container">
      <style>{homeStyles}</style>

      <Header />

      {error && (
        <div class="error-message">
          <h3>❌ 获取数据失败</h3>
          <p>{error}</p>
        </div>
      )}

      {priceData ? (
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
      ) : !error && (
        <div class="loading-message">
          <h3>⏳ 正在加载价格数据...</h3>
          <p>请稍候，正在从缓存或API获取最新数据</p>
        </div>
      )}
    </div>
  )
}

export default Home