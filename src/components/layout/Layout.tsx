import type { FC } from 'hono/jsx'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout: FC = ({ children }) => {
  return (
    <html>
      <head>
        <title>Price Demo</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8f9fa;
            min-height: 100vh;
            transition: all 0.3s ease;
          }
          
          /* 暗色主题全局样式 */
          body.dark-theme {
            background: #121212;
            color: #e0e0e0;
          }
          
          main {
            min-height: calc(100vh - 140px);
          }
        `}</style>
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <script src="/theme.js"></script>
      </body>
    </html>
  )
}

export default Layout