import { User } from '../types/user';

export async function getUserById(id: string): Promise<User | null> {
  // 这里可以是数据库查询、外部API调用等
  // 示例实现
  if (id === '1') {
    return {
      id: '1',
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'user'
    };
  }
  
  if (id === '2') {
    return {
      id: '2',
      name: '李四',
      email: 'lisi@example.com',
      role: 'admin'
    };
  }
  
  return null;
}

export async function getSystemInfo() {
  return {
    name: 'price-request-cf',
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  };
}