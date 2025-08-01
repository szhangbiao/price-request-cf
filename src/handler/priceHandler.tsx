import { Context } from 'hono';
import { PriceService } from '../service/priceService';
import { KVService } from '../service/kvService';
import { UpstashService } from '../service/upstashService';
import { PriceData, PriceStorage, Env } from '../types/price';

const KEY_REQUEST_DATA = 'request_data';

export class PriceHandler {
  private priceService: PriceService;
  private kvService: KVService;
  private upstashService: UpstashService;

  constructor(env: Env) {
    this.kvService = new KVService(env);
    this.priceService = new PriceService(env);
    this.upstashService = new UpstashService(env);
  }

  /**
   * 获取价格数据 - 按照 Redis、KV、接口请求的优先级
   * @param key 缓存键名
   * @param forceRefresh 是否强制刷新（跳过缓存）
   * @returns 价格数据
   */
  async getPriceData(key: string = KEY_REQUEST_DATA, forceRefresh: boolean = false): Promise<PriceData | null> {
    try {
      console.log(`开始获取价格数据，键名: ${key}, 强制刷新: ${forceRefresh}`);

      if (!forceRefresh) {
        // 1. 优先从 Redis 获取
        console.log('尝试从 Redis 获取数据...');
        const redisData = await this.getFromRedis(key);
        if (redisData) {
          console.log('从 Redis 获取数据成功');
          const data = redisData.data as PriceData;
          data.source = 'redis';
          return data;
        }

        // 2. 从 KV 获取
        console.log('Redis 无数据，尝试从 KV 获取数据...');
        const kvData = await this.getFromKV(key);
        if (kvData) {
          console.log('从 KV 获取数据成功，同时回写到 Redis');
          // 将 KV 数据回写到 Redis 以提高下次访问速度
          await this.saveToRedis(key, kvData.data, kvData.source);
          const data = kvData.data as PriceData;
           data.source = 'kv';
          return data;
        }
      }

      // 3. 从接口获取最新数据
      console.log('缓存无数据，从接口获取最新数据...');
      const apiData = await this.getFromAPI();
      if (apiData) {
        console.log('从接口获取数据成功，保存到缓存');
        // 同时保存到 Redis 和 KV
        await Promise.all([
          this.saveToRedis(key, apiData, 'api'),
          this.saveToKV(key, apiData, 'api')
        ]);
        apiData.source = 'api';
        return apiData;
      }

      console.warn('所有数据源都无法获取数据');
      return null;
    } catch (error) {
      console.error('获取价格数据失败:', error);
      return null;
    }
  }

  /**
   * 从 Redis 获取数据
   */
  private async getFromRedis(key: string): Promise<PriceStorage | null> {
    try {
      return await this.upstashService.getPrice(key);
    } catch (error) {
      console.error('从 Redis 获取数据失败:', error);
      return null;
    }
  }

  /**
   * 从 KV 获取数据
   */
  private async getFromKV(key: string): Promise<PriceStorage | null> {
    try {
      return await this.kvService.getPrice(key);
    } catch (error) {
      console.error('从 KV 获取数据失败:', error);
      return null;
    }
  }

  /**
   * 从 API 获取数据
   */
  private async getFromAPI(): Promise<PriceData | null> {
    try {
      return await this.priceService.getAllPriceData();
    } catch (error) {
      console.error('从 API 获取数据失败:', error);
      return null;
    }
  }

  /**
   * 保存数据到 Redis
   * 工作日缓存1小时，周末缓存1天
   */
  private async saveToRedis(key: string, data: any, source: string): Promise<void> {
    try {
      // 设置缓存时间（秒）
      const cacheTTL = 24 * 60 * 60
      
      console.log(`保存数据到 Redis，缓存时间: ${cacheTTL}秒`);
      
      // 使用自定义TTL保存数据
      await this.upstashService.savePriceWithTTL(key, data, source, cacheTTL);
    } catch (error) {
      console.error('保存数据到 Redis 失败:', error);
    }
  }

  /**
   * 保存数据到 KV
   * 工作日缓存1小时，周末缓存1天
   */
  private async saveToKV(key: string, data: any, source: string): Promise<void> {
    try {  
      // 设置缓存时间（秒）
      const cacheTTL = 24 * 60 * 60
      
      console.log(`保存数据到 KV，缓存时间: ${cacheTTL}秒`);
      
      // 使用自定义TTL保存数据
      await this.kvService.savePriceWithTTL(key, data, source, cacheTTL);
    } catch (error) {
      console.error('保存数据到 KV 失败:', error);
    }
  }

  /**
   * 清除指定键的缓存
   */
  async clearCache(key: string): Promise<void> {
    try {
      await Promise.all([
        this.upstashService.deletePrice(key),
        this.kvService.deletePrice(key)
      ]);
      console.log(`缓存清除成功: ${key}`);
    } catch (error) {
      console.error('清除缓存失败:', error);
    }
  }

  /**
   * 清除所有价格相关缓存
   */
  async clearAllCache(): Promise<void> {
    try {
      await Promise.all([
        this.clearCache(KEY_REQUEST_DATA)
      ]);
      console.log('所有价格缓存清除成功');
    } catch (error) {
      console.error('清除所有缓存失败:', error);
    }
  }

  /**
   * 从请求 body 中获取 PriceData 并缓存到 Redis 和 KV
   * @param priceData 价格数据
   * @param key 缓存键名，默认为 request_data
   * @returns 是否保存成功
   */
  async savePriceDataFromBody(priceData: PriceData, key: string = KEY_REQUEST_DATA): Promise<boolean> {
    try {
      console.log(`开始保存价格数据到缓存，键名: ${key}`);
      
      // 验证数据格式
      if (!priceData || typeof priceData !== 'object') {
        console.error('无效的价格数据格式');
        return false;
      }

      // 添加或更新时间戳
      const dataToSave = {
        ...priceData,
        updateTime: new Date().toISOString(),
        source: 'manual' // 标记为手动上传的数据
      };

      console.log('验证数据格式成功，开始保存到缓存...');

      // 同时保存到 Redis 和 KV
      await Promise.all([
        this.saveToRedis(key, dataToSave, 'manual'),
        this.saveToKV(key, dataToSave, 'manual')
      ]);

      console.log(`价格数据保存成功，键名: ${key}`);
      return true;
    } catch (error) {
      console.error('保存价格数据失败:', error);
      return false;
    }
  }

  /**
   * 获取缓存状态信息
   */
  async getCacheStatus(key: string): Promise<{
    redis: boolean;
    kv: boolean;
    redisTTL?: number;
  }> {
    try {
      const [redisExists, kvExists, redisTTL] = await Promise.all([
        this.upstashService.exists(key),
        this.kvService.exists(key),
        this.upstashService.getTTL(key)
      ]);

      return {
        redis: redisExists,
        kv: kvExists,
        redisTTL: redisTTL > 0 ? redisTTL : undefined
      };
    } catch (error) {
      console.error('获取缓存状态失败:', error);
      return { redis: false, kv: false };
    }
  }
}

/**
 * 导出的 savePriceData 函数，用于 API 路由保存价格数据
 * @param c Hono Context 对象
 * @returns JSON 响应
 */
export async function savePriceData(c: Context<{ Bindings: Env }>) {
  try {
    const env = c.env;
    const priceHandler = new PriceHandler(env);
    
    // 从请求 body 中获取价格数据
    const requestBody = await c.req.json();
    
    // 验证请求体是否包含有效的价格数据
    if (!requestBody || !requestBody.data) {
      return c.json({
        success: false,
        message: '请求体缺少价格数据',
        timestamp: Date.now()
      }, 400);
    }

    const priceData = requestBody.data as PriceData;
    
    // 获取可选的缓存键名，默认为 request_data
    const key = requestBody.key || KEY_REQUEST_DATA;
    
    // 保存价格数据到缓存
    const success = await priceHandler.savePriceDataFromBody(priceData, key);
    
    if (success) {
      return c.json({
        success: true,
        message: '价格数据保存成功',
        key,
        timestamp: Date.now()
      });
    } else {
      return c.json({
        success: false,
        message: '价格数据保存失败',
        key,
        timestamp: Date.now()
      }, 500);
    }
  } catch (error) {
    console.error('API 保存价格数据失败:', error);
    return c.json({
      success: false,
      message: '保存价格数据失败',
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: Date.now()
    }, 500);
  }
}

/**
 * 导出的 getPriceData 函数，用于 API 路由
 * @param c Hono Context 对象
 * @returns JSON 响应
 */
export async function getPriceData(c: Context<{ Bindings: Env }>) {
  try {
    const env = c.env;
    const priceHandler = new PriceHandler(env);
    
    const data = await priceHandler.getPriceData();
    
    if (data) {
      return c.json({
        success: true,
        message:'获取价格数据成功',
        data,
      });
    } else {
      return c.json({
        success: false,
        message: '无法获取价格数据',
        timestamp: Date.now()
      }, 500);
    }
  } catch (error) {
    console.error('API 获取价格数据失败:', error);
    return c.json({
      success: false,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: Date.now()
    }, 500);
  }
}

/**
 * 导出的 clearCache 函数，用于 API 路由清除缓存
 * @param c Hono Context 对象
 * @returns JSON 响应
 */
export async function clearCache(c: Context<{ Bindings: Env }>) {
  try {
    const env = c.env;
    const priceHandler = new PriceHandler(env);
    
    // 获取路径参数中的缓存键名
    const key = c.req.param('key');
    
    if (key) {
      // 清除指定键的缓存
      await priceHandler.clearCache(key);
      return c.json({
        success: true,
        message: `缓存清除成功: ${key}`,
        key,
        timestamp: Date.now()
      });
    } else {
      // 清除所有缓存
      await priceHandler.clearAllCache();
      return c.json({
        success: true,
        message: '所有价格缓存清除成功',
        timestamp: Date.now()
      });
    }
  } catch (error) {
    console.error('API 清除缓存失败:', error);
    return c.json({
      success: false,
      message: '清除缓存失败',
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: Date.now()
    }, 500);
  }
}