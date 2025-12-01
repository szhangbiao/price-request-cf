import { GoldData, StockData, ExchangeRateData } from '../../types/price';
import { BaseTemplate } from './BaseTemplate';
import { EmailTemplateData } from './types';

/**
 * 默认邮件模板
 * 保持原有的精美卡片式设计风格
 */
export class DefaultTemplate extends BaseTemplate {
    getName(): string {
        return '默认模板';
    }

    getDescription(): string {
        return '精美的卡片式设计，包含图标和丰富的样式';
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
        <body style="font-family: 'Microsoft YaHei', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; margin-top: 0;">
              📈 价格数据更新通知
            </h2>

            <p style="color: #7f8c8d; margin: 15px 0;">
              <strong>更新时间：</strong>${updateTime}
            </p>

            <p style="color: #7f8c8d; margin: 15px 0;">
              <strong>数据来源：</strong>${priceData.source || '未知'}
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
      <div style="margin: 20px 0; border: 1px solid #ffeeba; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
        <div style="background-color: #fff3cd; padding: 12px 20px; border-bottom: 1px solid #ffeeba;">
          <h3 style="margin: 0; color: #856404; font-size: 16px; display: flex; align-items: center;">
            <span style="margin-right: 8px;">📊</span> 黄金价格
          </h3>
        </div>
        <div style="padding: 20px; background-color: #ffffff;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; width: 40%;"><strong>品种</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; text-align: right;">${gold.variety}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666;"><strong>最新价</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; font-size: 16px; text-align: right;">${gold.latestpri}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;"><strong>涨跌</strong></td>
              <td style="padding: 10px 0; color: ${limitColor}; font-weight: bold; text-align: right;">${gold.limit}</td>
            </tr>
          </table>
        </div>
      </div>
    `;
    }

    protected generateExchangeRateSection(rate: ExchangeRateData): string {
        return `
      <div style="margin: 20px 0; border: 1px solid #bee5eb; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
        <div style="background-color: #d1ecf1; padding: 12px 20px; border-bottom: 1px solid #bee5eb;">
          <h3 style="margin: 0; color: #0c5460; font-size: 16px; display: flex; align-items: center;">
            <span style="margin-right: 8px;">💱</span> 汇率信息
          </h3>
        </div>
        <div style="padding: 20px; background-color: #ffffff;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; width: 40%;"><strong>货币对</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; text-align: right;">${rate.currencyF_Name} → ${rate.currencyT_Name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;"><strong>汇率</strong></td>
              <td style="padding: 10px 0; color: #17a2b8; font-weight: bold; font-size: 16px; text-align: right;">${rate.exchange}</td>
            </tr>
          </table>
        </div>
      </div>
    `;
    }

    protected generateStocksSection(stocks: StockData[]): string {
        const stockRows = stocks.map(stock => {
            const changeColor = this.getChangeColor(stock.change);
            const changeSign = this.getChangeSign(stock.change);
            return `
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #eee; font-size: 14px;"><strong>${stock.name}</strong></td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #eee; font-weight: bold; text-align: right; font-size: 14px;">${stock.current.toFixed(2)}</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #eee; color: ${changeColor}; text-align: right; font-size: 14px;">${changeSign}${stock.change.toFixed(2)}</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #eee; color: ${changeColor}; font-weight: bold; text-align: right; font-size: 14px;">${changeSign}${stock.percent.toFixed(2)}%</td>
        </tr>
      `;
        }).join('');

        return `
      <div style="margin: 20px 0; border: 1px solid #cce5ff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
        <div style="background-color: #e7f3ff; padding: 12px 20px; border-bottom: 1px solid #cce5ff;">
          <h3 style="margin: 0; color: #004085; font-size: 16px; display: flex; align-items: center;">
            <span style="margin-right: 8px;">📊</span> 三大指数
          </h3>
        </div>
        <div style="padding: 0; background-color: #ffffff;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 12px 15px; border-bottom: 1px solid #eee; text-align: left; color: #666; font-weight: 600; font-size: 13px;">指数名称</th>
              <th style="padding: 12px 15px; border-bottom: 1px solid #eee; text-align: right; color: #666; font-weight: 600; font-size: 13px;">当前价格</th>
              <th style="padding: 12px 15px; border-bottom: 1px solid #eee; text-align: right; color: #666; font-weight: 600; font-size: 13px;">涨跌额</th>
              <th style="padding: 12px 15px; border-bottom: 1px solid #eee; text-align: right; color: #666; font-weight: 600; font-size: 13px;">涨跌幅</th>
            </tr>
            ${stockRows}
          </table>
        </div>
      </div>
    `;
    }
}
