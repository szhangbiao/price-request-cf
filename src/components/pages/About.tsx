import type { FC } from 'hono/jsx'
import Header from './Header'

const About: FC = () => {
  return (
    <div class="about-container">

      <Header 
        title="关于我们" 
        subtitle="了解我们的价格请求服务及其功能" 
      />

      <div class="about-content">
        <h2 class="about-title">价格请求服务</h2>
        <p class="about-description">这是一个价格请求服务的示例应用，提供实时的黄金价格、汇率和股票指数信息。我们的数据来源可靠，更新及时，为您提供准确的市场信息。</p>
        
        <div class="feature-list">
          <div class="feature-item">
            <h3 class="feature-title">实时数据</h3>
            <p class="feature-description">我们的系统定期从多个可靠来源获取最新的价格数据，确保您获得的信息是最新的。</p>
          </div>
          
          <div class="feature-item">
            <h3 class="feature-title">多种资产</h3>
            <p class="feature-description">覆盖黄金、主要货币汇率和重要股票指数，满足您多样化的市场信息需求。</p>
          </div>
          
          <div class="feature-item">
            <h3 class="feature-title">高效缓存</h3>
            <p class="feature-description">采用高效的缓存机制，在保证数据新鲜度的同时提供快速的响应速度。</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About