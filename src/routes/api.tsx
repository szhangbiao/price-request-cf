import { Hono } from 'hono'
import { getUserHandler } from '../handler/userHandler'
import { getInfoHandler } from '../handler/infoHandler'
import { authMiddleware } from '../middleware/auth'

const api = new Hono()

// 只对用户相关路由应用认证中间件
api.get('/info', getInfoHandler) // 公开接口，不需要认证
api.get('/users/:id', authMiddleware, getUserHandler) // 需要认证

export default api