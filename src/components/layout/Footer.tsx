import type { FC } from 'hono/jsx'
import { footerStyles } from './footerStyles'

const Footer: FC = () => {
  return (
    <footer>
      <style>{footerStyles}</style>
      <div class="footer-content">
        <div class="footer-links">
          <a href="/">首页</a>
          <a href="/about">关于</a>
          <a href="/api/prices">API</a>
          <a href="https://github.com" target="_blank">GitHub</a>
        </div>
        <p>© 2025 Price Demo - 实时价格数据服务</p>
      </div>
    </footer>
  )
}

export default Footer