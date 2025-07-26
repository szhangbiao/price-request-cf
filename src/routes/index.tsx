import { Hono } from 'hono'

// 导入组件
import { Layout, Home, About } from '../components'

const router = new Hono()

// 使用JSX渲染路由
router.get('/', (c) => c.html(<Layout><Home /></Layout>))
router.get('/about', (c) => c.html(<Layout><About /></Layout>))

export default router