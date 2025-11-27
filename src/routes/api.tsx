import { Hono } from 'hono'
import { getPriceData, savePriceData, clearCache } from '../handler/priceHandler'
import { Env } from '../types/price'

const api = new Hono<{ Bindings: Env }>()

// 获取价格数据的主要接口
api.get('/price/request', getPriceData)
api.post('/price/post', savePriceData)
api.delete('/clearCache', clearCache)

// 健康检查接口
api.get('/health', (c) => {
  return c.json({
    success: true,
    message: 'API 服务正常',
    timestamp: Date.now(),
    version: '1.0.1'
  });
})

export default api