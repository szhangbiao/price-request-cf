import { Context } from 'hono';
import { getUserById } from '../service/userService';

export async function getUserHandler(c: Context) {
  const id = c.req.param('id');
  
  // 参数验证
  if (!id) {
    return c.json({ error: '用户ID不能为空' }, 400);
  }
  
  try {
    // 调用service层
    const user = await getUserById(id);
    
    if (!user) {
      return c.json({ error: '用户不存在' }, 404);
    }
    
    // 返回成功响应
    return c.json(user);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return c.json({ error: '服务器内部错误' }, 500);
  }
}