import { Context, Next } from 'hono'

export async function authMiddleware(c: Context, next: Next) {
  const token = c.req.header('Authorization')?.split(' ')[1]
  
  if (!token) {
    return c.json({ error: '未授权访问' }, 401)
  }
  
  // 这里可以验证token
  // 例如：const user = await verifyToken(token)
  
  // 将用户信息添加到上下文中
  c.set('user', { id: '1', role: 'admin' })
  
  await next()
}