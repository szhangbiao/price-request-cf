import type { FC } from 'hono/jsx'

const Home: FC = () => {
  return (
    <div>
      <h2>欢迎使用价格请求服务</h2>
      <p>这是一个使用Cloudflare Worker和Hono构建的应用。</p>
    </div>
  )
}

export default Home