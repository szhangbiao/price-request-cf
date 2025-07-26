import { KVNamespace } from '@cloudflare/workers-types';

export interface PriceData {
  timestamp: number;
  data: any;
  source: string;
}

export class KVService {
  private kv: KVNamespace;
  private cacheTTL: number; // 缓存过期时间（秒）

  constructor(kv: KVNamespace, cacheTTL: number = 3600) {
    this.kv = kv;
    this.cacheTTL = cacheTTL;
  }

  // 保存价格数据到KV
  async savePrice(key: string, data: any, source: string): Promise<void> {
    const priceData: PriceData = {
      timestamp: Date.now(),
      data,
      source
    };
    
    // 将数据存储到KV，设置过期时间
    await this.kv.put(key, JSON.stringify(priceData), {
      expirationTtl: this.cacheTTL
    });
  }

  // 从KV获取价格数据
  async getPrice(key: string): Promise<PriceData | null> {
    const data = await this.kv.get(key);
    if (!data) return null;
    
    try {
      return JSON.parse(data) as PriceData;
    } catch (error) {
      console.error('解析KV数据失败:', error);
      return null;
    }
  }

  // 删除价格数据
  async deletePrice(key: string): Promise<void> {
    await this.kv.delete(key);
  }

  // 列出所有价格数据的键
  async listPriceKeys(prefix?: string): Promise<string[]> {
    const list = await this.kv.list({ prefix });
    return list.keys.map(k => k.name);
  }
}