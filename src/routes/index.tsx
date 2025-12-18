import { Hono } from 'hono'
import Layout from '../components/layout/Layout'
import Home from '../components/pages/Home'
import { About } from '../components'
import { PriceHandler } from '../handler/priceHandler'

const router = new Hono<{ Bindings: Env }>()

// 使用JSX渲染路由
router.get('/', async (c) => {
  try {
    // 创建 PriceHandler 实例
    const priceHandler = new PriceHandler(c.env)

    // 获取价格数据
    const priceData = await priceHandler.getPriceData()

    return c.html(
      <Layout currentPath="/">
        <Home priceData={priceData} />
      </Layout>
    )
  } catch (error) {
    console.error('获取价格数据失败:', error)

    return c.html(
      <Layout currentPath="/">
        <Home error={error instanceof Error ? error.message : '获取价格数据时发生未知错误'} />
      </Layout>
    )
  }
})
router.get('/about', (c) => c.html(<Layout currentPath="/about"><About /></Layout>))

export default router