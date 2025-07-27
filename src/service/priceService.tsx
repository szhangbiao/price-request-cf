import {
  ApiResponse,
  GoldData,
  MetalVarietiesMap,
  ExchangeRateData,
  StockData,
  PriceData,
  Env
} from '../types/price';

export class PriceService {
  private env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  /**
   * 获取黄金价格数据
   * @returns 黄金价格数据或null
   */
  private async getGoldPrice(): Promise<GoldData | null> {
    try {
      // 从环境变量获取API URL和密钥
      const url = `${this.env.GOLD_API_URL}${this.env.JUHE_GOLD_APPKEY}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as ApiResponse<MetalVarietiesMap[]>;
      
      // 根据聚合数据API的响应格式处理数据
      if (data.error_code === 0 && data.result && data.result.length > 0) {
        const goldInfo = data.result[0];
        return goldInfo['Au99.99'];
      }
      
      return null;
    } catch (error) {
      console.error('获取黄金价格失败:', error);
      return null;
    }
  }

  /**
   * 获取汇率数据
   * @returns 汇率数据或null
   */
  private async getExchangeRate(): Promise<ExchangeRateData | null> {
    try {
      // 从环境变量获取API URL和密钥
      const url = `${this.env.EXCHANGE_RATE_API_URL}${this.env.JUHE_EXCHANGE_RATE_APPKEY}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as ApiResponse<ExchangeRateData[]>;
      
      // 根据聚合数据API的响应格式处理数据
      if (data.error_code === 0 && data.result) {
        const rateInfo = data.result;
        return rateInfo[0];
      }
      
      return null;
    } catch (error) {
      console.error('获取汇率失败:', error);
      return null;
    }
  }

  private async getStockDatas(): Promise<StockData[] | null> {
    const stockCode = ["s_sh000001","s_sz399001","s_sz399006"];
    const baseUrl = "https://hq.sinajs.cn/list=";
    const stockDataList: StockData[] = [];

    try {
      // 循环调用每个股票代码
      for (const code of stockCode) {
        const url = `${baseUrl}${code}`;
        console.log(`正在获取股票数据: ${code}`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Referer':'https://finance.sina.com.cn',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Charset': 'GBK,utf-8;q=0.7,*;q=0.3'
          }
        });

        if (!response.ok) {
          console.error(`获取股票 ${code} 数据失败: HTTP ${response.status}`);
          continue;
        }

        // 获取原始字节数据
        const arrayBuffer = await response.arrayBuffer();
        
        // 尝试使用GBK解码，如果不支持则使用UTF-8
        let textData: string;
        try {
          // 在Cloudflare Workers环境中，我们需要手动处理GBK编码
          const decoder = new TextDecoder('gbk');
          textData = decoder.decode(arrayBuffer);
        } catch (error) {
          // 如果GBK解码失败，回退到UTF-8
          console.warn(`GBK解码失败，使用UTF-8解码: ${error}`);
          const decoder = new TextDecoder('utf-8');
          textData = decoder.decode(arrayBuffer);
        }

        // 解析新浪财经API返回的数据格式
        // 格式: var hq_str_s_sh000001="上证指数,3000.00,10.00,0.33,1000000,100000000";
        const match = textData.match(/="([^"]+)"/);
        if (match && match[1]) {
          const dataArray = match[1].split(',');
          if (dataArray.length >= 6) {
            const stockData: StockData = {
              name: dataArray[0] || code,
              current: Number((parseFloat(dataArray[1]) || 0).toFixed(2)),
              change: Number((parseFloat(dataArray[2]) || 0).toFixed(2)),
              percent: Number((parseFloat(dataArray[3]) || 0).toFixed(2)),
              volume: parseInt(dataArray[4]) || 0,
              amount: parseInt(dataArray[5]) || 0,
            };
            stockDataList.push(stockData);
            console.log(`成功解析股票数据: ${stockData.name}`);
          }
        } else {
          console.warn(`无法解析股票 ${code} 的数据格式`);
        }
      }

      console.log(`成功获取 ${stockDataList.length} 个股票数据`);
      return stockDataList.length > 0 ? stockDataList : null;
      
    } catch (error) {
      console.error('获取股票数据失败:', error);
      return null;
    }
  }

  /**
   * 获取完整的价格数据
   * @returns 包含黄金、汇率和股票数据的PriceData对象或null
   */
  async getAllPriceData(): Promise<PriceData | null> {
    try {
      console.log('开始获取所有价格数据...');
      
      // 并行获取所有数据
      const [goldData, exchangeRateData, stockDataList] = await Promise.all([
        this.getGoldPrice(),
        this.getExchangeRate(),
        this.getStockDatas() // symbol参数暂时不使用
      ]);

      // 检查是否至少有一种数据获取成功
      if (!goldData && !exchangeRateData && !stockDataList) {
        console.warn('所有价格数据获取失败');
        return null;
      }

      const priceData: PriceData = {
        type: 2, // 可以根据需要设置类型
        updateTime: new Date().toISOString(), // 添加当前时间戳
      };

      // 只添加成功获取的数据
      if (goldData) {
        priceData.gold = goldData;
      }

      if (exchangeRateData) {
        priceData.exchangeRate = exchangeRateData;
      }

      if (stockDataList && stockDataList.length > 0) {
        priceData.stocks = stockDataList;
      }

      console.log('成功获取完整价格数据');
      return priceData;
      
    } catch (error) {
      console.error('获取完整价格数据失败:', error);
      return null;
    }
  }
}