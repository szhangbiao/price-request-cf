import { Hono } from 'hono'
import { getUserHandler } from '../handler/userHandler'
import { getInfoHandler } from '../handler/infoHandler'

const api = new Hono()

// 使用handler处理请求
api.get('/info', getInfoHandler)
api.get('/users/:id', getUserHandler)

export default api