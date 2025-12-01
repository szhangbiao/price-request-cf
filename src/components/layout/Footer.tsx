import type { FC } from 'hono/jsx'

const Footer: FC = () => {
  return (
    <footer>
      <div class="footer-content">
        <div class="footer-links">
          <a href="/" class="footer-link">首页</a>
          <a href="/about" class="footer-link">关于</a>
          <a href="https://www.juhe.cn/" class="footer-link">API</a>
          <a href="https://github.com/szhangbiao/price-request-cf" target="_blank" class="footer-link">GitHub</a>
        </div>
        <p class="footer-text">© 2025 Price Pole - 实时价格数据服务</p>
      </div>
    </footer>
  )
}

export default Footer