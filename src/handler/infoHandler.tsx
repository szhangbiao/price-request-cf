import { Context } from 'hono';
import { getSystemInfo } from '../service/userService';

export async function getInfoHandler(c: Context) {
  try {
    const info = await getSystemInfo();
    return c.json(info);
  } catch (error) {
    console.error('获取系统信息失败:', error);
    return c.json({ error: '服务器内部错误' }, 500);
  }
}