import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'


const api = new Hono()

api.get('/price/request')
api.get('/price/crawl')

export default api