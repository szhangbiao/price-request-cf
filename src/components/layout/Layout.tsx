import type { FC } from 'hono/jsx'
import Navbar from './Navbar'
import Footer from './Footer'
import { layoutStyles } from './layoutStyles'

interface LayoutProps {
  currentPath?: string;
  children?: any;
}

const Layout: FC<LayoutProps> = ({ children, currentPath = '/' }) => {
  // 根据当前路径设置导航链接的active状态
  const navLinks = [
    { href: "/", label: "首页", active: currentPath === '/' },
    { href: "/about", label: "关于", active: currentPath === '/about' }
  ];

  return (
    <html>
      <head>
        <title>Price Demo</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <style>{layoutStyles}</style>
      </head>
      <body>
        <Navbar links={navLinks} />
        <main>{children}</main>
        <Footer />
        <script src="/theme.js"></script>
      </body>
    </html>
  )
}

export default Layout