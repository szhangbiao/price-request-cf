import type { FC } from 'hono/jsx'

const Layout: FC = ({ children }) => {
  return (
    <html>
      <head>
        <title>Price Request CF</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <header>
          <h1>Price Request CF</h1>
          <nav>
            <a href="/">首页</a>
            <a href="/about">关于</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer>© 2023 Price Request CF</footer>
      </body>
    </html>
  )
}

export default Layout