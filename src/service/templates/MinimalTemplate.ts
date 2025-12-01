import { GoldData, StockData, ExchangeRateData } from '../../types/price';
import { BaseTemplate } from './BaseTemplate';
import { EmailTemplateData } from './types';

/**
 * 简洁邮件模板
 * 提供更简洁的表格布局，减少装饰性元素
 */
export class MinimalTemplate extends BaseTemplate {
    getName(): string {
        return '简洁模板';
    }

    getDescription(): string {
        return '简洁的表格布局，减少装饰性元素，适合快速浏览';
    }

    generateHtml(data: EmailTemplateData): string {
        const { priceData } = data;
        const updateTime = this.formatUpdateTime(priceData.updateTime);

        const goldSection = priceData.gold ? this.generateGoldSection(priceData.gold) : '';
        const exchangeRateSection = priceData.exchangeRate ? this.generateExchangeRateSection(priceData.exchangeRate) : '';
        const stocksSection = priceData.stocks && priceData.stocks.length > 0 ? this.generateStocksSection(priceData.stocks) : '';

        return `
      <!DOCTYPE html>
      <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>价格数据更新通知</title>
        </head>
        <body style="font-family: 'Microsoft YaHei', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; padding: 25px; border: 1px solid #ddd;">
            <h2 style="color: #333; border-bottom: 2px solid #666; padding-bottom: 8px; margin-top: 0; font-size: 18px;">
              价格数据更新通知
            </h2>

            <p style="color: #666; margin: 12px 0; font-size: 13px;">
              更新时间：${updateTime} | 数据来源：${priceData.source || '未知'}
            </p>

            ${stocksSection}
            ${goldSection}
            ${exchangeRateSection}

            ${this.generateFooter()}
          </div>
        </body>
      </html>
    `;
    }

    protected generateGoldSection(gold: GoldData): string {
        const limitValue = parseFloat(gold.limit);
        const limitColor = this.getChangeColor(limitValue);

        return `
      <div style="margin: 15px 0;">
        <h3 style="margin: 10px 0 8px 0; color: #555; font-size: 15px; border-left: 3px solid #f0ad4e; padding-left: 8px;">黄金价格</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 8px 12px; border: 1px solid #ddd; width: 30%; font-weight: 600;">品种</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd;">${gold.variety}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: 600;">最新价</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: bold;">${gold.latestpri}</td>
          </tr>
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: 600;">涨跌</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd; color: ${limitColor}; font-weight: bold;">${gold.limit}</td>
          </tr>
        </table>
      </div>
    `;
    }

    protected generateExchangeRateSection(rate: ExchangeRateData): string {
        return `
      <div style="margin: 15px 0;">
        <h3 style="margin: 10px 0 8px 0; color: #555; font-size: 15px; border-left: 3px solid #5bc0de; padding-left: 8px;">汇率信息</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 8px 12px; border: 1px solid #ddd; width: 30%; font-weight: 600;">货币对</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd;">${rate.currencyF_Name} → ${rate.currencyT_Name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: 600;">汇率</td>
            <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: bold; color: #17a2b8;">${rate.exchange}</td>
          </tr>
        </table>
      </div>
    `;
    }

    protected generateStocksSection(stocks: StockData[]): string {
        const stockRows = stocks.map((stock, index) => {
            const changeColor = this.getChangeColor(stock.change);
            const changeSign = this.getChangeSign(stock.change);
            const bgColor = index % 2 === 0 ? '#f5f5f5' : '#ffffff';
            return `
        <tr style="background-color: ${bgColor};">
          <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: 600;">${stock.name}</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${stock.current.toFixed(2)}</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd; text-align: right; color: ${changeColor};">${changeSign}${stock.change.toFixed(2)}</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd; text-align: right; color: ${changeColor}; font-weight: bold;">${changeSign}${stock.percent.toFixed(2)}%</td>
        </tr>
      `;
        }).join('');

        return `
      <div style="margin: 15px 0;">
        <h3 style="margin: 10px 0 8px 0; color: #555; font-size: 15px; border-left: 3px solid #0275d8; padding-left: 8px;">三大指数</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <tr style="background-color: #e9ecef;">
            <th style="padding: 8px 12px; border: 1px solid #ddd; text-align: left; font-weight: 600;">指数名称</th>
            <th style="padding: 8px 12px; border: 1px solid #ddd; text-align: right; font-weight: 600;">当前价格</th>
            <th style="padding: 8px 12px; border: 1px solid #ddd; text-align: right; font-weight: 600;">涨跌额</th>
            <th style="padding: 8px 12px; border: 1px solid #ddd; text-align: right; font-weight: 600;">涨跌幅</th>
          </tr>
          ${stockRows}
        </table>
      </div>
    `;
    }

    protected generateFooter(): string {
        return `
      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 11px;">
        <p style="margin: 5px 0;">这是一封自动发送的邮件，请勿回复。</p>
        <p style="margin: 5px 0;">© ${new Date().getFullYear()} 价格监控系统</p>
      </div>
    `;
    }
}
