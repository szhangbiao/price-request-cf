import { PriceStorage } from '../types/price';

export class KVService {
  private kv: KVNamespace;
  private cacheTTL: number; // 缓存过期时间（秒）

  constructor(env: Env, cacheTTL: number = 3600) {
    this.kv = env.PRICE_DATA;
    this.cacheTTL = cacheTTL;
  }

  /**
   * 保存价格数据到KV
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

      // 将数据存储到KV，设置过期时间
      await this.kv.put(key, JSON.stringify(priceData), {
        expirationTtl: this.cacheTTL
      });
    } catch (error) {
      console.error('保存数据到KV失败:', error);
      throw error;
    }
  }

  /**
   * 保存数据并设置自定义TTL
   * @param key 存储键
   * @param data 数据内容
   * @param source 数据来源
   * @param customTTL 自定义过期时间（秒）
   */
  async savePriceWithTTL(key: string, data: any, source: string, customTTL: number): Promise<void> {
    try {
      const priceData: PriceStorage = {
        timestamp: Date.now(),
        data,
        source
      };

      await this.kv.put(key, JSON.stringify(priceData), {
        expirationTtl: customTTL
      });
    } catch (error) {
      console.error('保存数据到KV失败:', error);
      throw error;
    }
  }

  /**
   * 从KV获取价格数据
   * @param key 存储键
   * @returns 价格数据或null
   */
  async getPrice(key: string): Promise<PriceStorage | null> {
    try {
      const data = await this.kv.get(key, 'text');
      if (!data) return null;

      return JSON.parse(data) as PriceStorage;
    } catch (error) {
      console.error('从KV获取数据失败:', error);
      return null;
    }
  }

  /**
   * 删除价格数据
   * @param key 存储键
   */
  async deletePrice(key: string): Promise<void> {
    try {
      await this.kv.delete(key);
    } catch (error) {
      console.error('从KV删除数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取匹配前缀的所有键
   * @param prefix 键前缀
   * @param limit 限制数量，默认1000
   * @returns 键数组
   */
  async getKeys(prefix: string, limit: number = 1000): Promise<string[]> {
    try {
      const result = await this.kv.list({ prefix, limit });
      return result.keys.map(key => key.name);
    } catch (error) {
      console.error('获取KV键失败:', error);
      return [];
    }
  }

  /**
   * 检查键是否存在
   * @param key 存储键
   * @returns 是否存在
   */
  async exists(key: string): Promise<boolean> {
    try {
      const data = await this.kv.get(key);
      return data !== null;
    } catch (error) {
      console.error('检查KV键存在性失败:', error);
      return false;
    }
  }

  /**
   * 获取键的元数据（包含过期时间等信息）
   * @param key 存储键
   * @returns 键的元数据或null
   */
  async getMetadata(key: string): Promise<any> {
    try {
      const result = await this.kv.getWithMetadata(key);
      return result.metadata;
    } catch (error) {
      console.error('获取KV键元数据失败:', error);
      return null;
    }
  }

  /**
   * 批量删除匹配前缀的键
   * @param prefix 键前缀
   */
  async clearPattern(prefix: string): Promise<void> {
    try {
      const keys = await this.getKeys(prefix);

      // KV 不支持批量删除，需要逐个删除
      const deletePromises = keys.map(key => this.kv.delete(key));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('清空KV匹配键失败:', error);
      throw error;
    }
  }
}