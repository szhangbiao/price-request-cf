import { Redis } from '@upstash/redis/cloudflare';
import { PriceStorage, Env } from '../types/price';

export class UpstashService {
  private redis: Redis;
  private cacheTTL: number; // 缓存过期时间（秒）

  constructor(env: Env, cacheTTL: number = 3600) {
    this.redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
    this.cacheTTL = cacheTTL;
  }

  /**
   * 保存价格数据到Redis
   * @param key 存储键
   * @param data 数据内容
   * @param source 数据来源
   */
  async savePrice(key: string, data: any, source: string): Promise<void> {
    try {
      const priceData: PriceStorage = {
        timestamp: Date.now(),
        data,
        source
      };
      
      // 将数据存储到Redis，设置过期时间
      await this.redis.setex(key, this.cacheTTL, JSON.stringify(priceData));
    } catch (error) {
      console.error('保存数据到Redis失败:', error);
      throw error;
    }
  }

  /**
   * 从Redis获取价格数据
   * @param key 存储键
   * @returns 价格数据或null
   */
  async getPrice(key: string): Promise<PriceStorage | null> {
    try {
      const data = await this.redis.get(key);
      if (!data) return null;
      
      if (typeof data === 'string') {
        return JSON.parse(data) as PriceStorage;
      }
      
      // 如果Redis返回的是对象，直接返回
      return data as PriceStorage;
    } catch (error) {
      console.error('从Redis获取数据失败:', error);
      return null;
    }
  }

  /**
   * 删除价格数据
   * @param key 存储键
   */
  async deletePrice(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('从Redis删除数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取匹配模式的所有键
   * @param pattern 匹配模式
   * @returns 键数组
   */
  async getKeys(pattern: string): Promise<string[]> {
    try {
      const keys = await this.redis.keys(pattern);
      return Array.isArray(keys) ? keys : [];
    } catch (error) {
      console.error('获取Redis键失败:', error);
      return [];
    }
  }

  /**
   * 设置键的过期时间
   * @param key 存储键
   * @param ttl 过期时间（秒）
   */
  async setExpire(key: string, ttl: number): Promise<void> {
    try {
      await this.redis.expire(key, ttl);
    } catch (error) {
      console.error('设置Redis键过期时间失败:', error);
      throw error;
    }
  }

  /**
   * 检查键是否存在
   * @param key 存储键
   * @returns 是否存在
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('检查Redis键存在性失败:', error);
      return false;
    }
  }

  /**
   * 获取键的剩余过期时间
   * @param key 存储键
   * @returns 剩余时间（秒），-1表示永不过期，-2表示键不存在
   */
  async getTTL(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      console.error('获取Redis键TTL失败:', error);
      return -2;
    }
  }

  /**
   * 清空所有匹配模式的键
   * @param pattern 匹配模式
   */
  async clearPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.getKeys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('清空Redis匹配键失败:', error);
      throw error;
    }
  }
}