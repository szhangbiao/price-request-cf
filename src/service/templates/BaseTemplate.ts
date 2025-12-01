import { GoldData, StockData, ExchangeRateData } from '../../types/price';
import { IEmailTemplate, EmailTemplateData } from './types';

/**
 * 邮件模板基类
 * 提供通用的辅助方法和共享逻辑
 */
export abstract class BaseTemplate implements IEmailTemplate {
    abstract generateHtml(data: EmailTemplateData): string;
    abstract getName(): string;
    abstract getDescription(): string;

    /**
     * 格式化更新时间
     */
    protected formatUpdateTime(updateTime: string): string {
        return new Date(updateTime).toLocaleString('zh-CN', {
            timeZone: 'Asia/Shanghai',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }

    /**
     * 获取涨跌颜色（涨红跌绿）
     */
    protected getChangeColor(value: number): string {
        return value >= 0 ? '#dc3545' : '#28a745';
    }

    /**
     * 获取涨跌符号
     */
    protected getChangeSign(value: number): string {
        return value >= 0 ? '+' : '';
    }

    /**
     * 生成黄金价格 HTML 片段
     */
    protected abstract generateGoldSection(gold: GoldData): string;

    /**
     * 生成汇率信息 HTML 片段
     */
    protected abstract generateExchangeRateSection(rate: ExchangeRateData): string;

    /**
     * 生成股票指数 HTML 片段
     */
    protected abstract generateStocksSection(stocks: StockData[]): string;

    /**
     * 生成页脚 HTML 片段
     */
    protected generateFooter(): string {
        return `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #95a5a6; font-size: 12px;">
        <p>这是一封自动发送的邮件，请勿回复。</p>
        <p>© ${new Date().getFullYear()} 价格监控系统 | Powered by Price Pole</p>
      </div>
    `;
    }
}
