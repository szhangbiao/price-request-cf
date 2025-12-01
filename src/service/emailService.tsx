import { PriceData, GoldData, ExchangeRateData } from '../types/price';

/**
 * 邮件发送服务
 * 使用自定义邮件发送 API
 */
export class EmailService {
  private readonly MAIL_API = 'https://mailsend.szhangbiao.cn/api/mail/send';
  private fromEmail: string;

  constructor(fromEmail: string = 'noreply@szhangbiao.cn') {
    this.fromEmail = fromEmail;
  }

  /**
   * 发送纯文本邮件
   * @param to 收件人邮箱
   * @param subject 邮件主题
   * @param content 邮件内容（纯文本）
   */
  async sendTextEmail(to: string, subject: string, content: string): Promise<boolean> {
    try {
      const response = await fetch(this.MAIL_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: to,
          subject: subject,
          content: content,
          isHtml: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('邮件发送失败:', response.status, errorText);
        return false;
      }

      console.log(`邮件发送成功: ${to}`);
      return true;
    } catch (error) {
      console.error('邮件发送异常:', error);
      return false;
    }
  }

  /**
   * 发送 HTML 邮件
   * @param to 收件人邮箱
   * @param subject 邮件主题
   * @param htmlContent HTML 内容
   * @param toName 收件人姓名（可选）
   */
  async sendHtmlEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
    try {
      const response = await fetch(this.MAIL_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: to,
          subject: subject,
          content: htmlContent,
          isHtml: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('邮件发送失败:', response.status, errorText);
        return false;
      }

      console.log(`HTML 邮件发送成功: ${to}`);
      return true;
    } catch (error) {
      console.error('邮件发送异常:', error);
      return false;
    }
  }

  async sendPriceTextEmail(to: string, priceData: PriceData): Promise<boolean> {
    const subject = `价格数据更新通知 - ${new Date(priceData.updateTime).toLocaleString('zh-CN')}`;
    const content = this.generatePriceUpdateText(priceData);
    return await this.sendTextEmail(to, subject, content);
  }

  /**
   * 发送价格数据更新通知邮件
   * @param to 收件人邮箱
   * @param priceData 价格数据
   */
  async sendPriceHtmlEmail(to: string, priceData: PriceData): Promise<boolean> {

    const subject = `价格数据更新通知 - ${new Date(priceData.updateTime).toLocaleString('zh-CN')}`;

    // 生成 HTML 内容
    const htmlContent = this.generatePriceUpdateHtml(priceData);

    return await this.sendHtmlEmail(to, subject, htmlContent);
  }

  /**
   * 发送价格数据更新通知给多个收件人
   * @param recipients 收件人列表
   * @param priceData 价格数据
   */
  async sendPriceUpdateToMultiple(recipients: Array<{ email: string; name?: string }>, priceData: PriceData): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const recipient of recipients) {
      const result = await this.sendPriceHtmlEmail(recipient.email, priceData,);
      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    console.log(`批量发送完成 - 成功: ${success}, 失败: ${failed}`);
    return { success, failed };
  }

  /**
   * 生成价格更新的 HTML 邮件内容
   */
  private generatePriceUpdateHtml(priceData: PriceData): string {
    const updateTime = new Date(priceData.updateTime).toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    let goldSection = '';
    if (priceData.gold) {
      const gold = priceData.gold;
      // 解析涨跌数据，判断是涨还是跌
      const limitValue = parseFloat(gold.limit);
      const limitColor = limitValue >= 0 ? '#dc3545' : '#28a745'; // 涨红跌绿

      goldSection = `
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

    let exchangeRateSection = '';
    if (priceData.exchangeRate) {
      const rate = priceData.exchangeRate;
      exchangeRateSection = `
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

    let stocksSection = '';
    if (priceData.stocks && priceData.stocks.length > 0) {
      const stockRows = priceData.stocks.map(stock => {
        const changeColor = stock.change >= 0 ? '#dc3545' : '#28a745'; // 涨红跌绿
        const changeSign = stock.change >= 0 ? '+' : '';
        return `
          <tr>
            <td style="padding: 12px 15px; border-bottom: 1px solid #eee; font-size: 14px;"><strong>${stock.name}</strong></td>
            <td style="padding: 12px 15px; border-bottom: 1px solid #eee; font-weight: bold; text-align: right; font-size: 14px;">${stock.current.toFixed(2)}</td>
            <td style="padding: 12px 15px; border-bottom: 1px solid #eee; color: ${changeColor}; text-align: right; font-size: 14px;">${changeSign}${stock.change.toFixed(2)}</td>
            <td style="padding: 12px 15px; border-bottom: 1px solid #eee; color: ${changeColor}; font-weight: bold; text-align: right; font-size: 14px;">${changeSign}${stock.percent.toFixed(2)}%</td>
          </tr>
        `;
      }).join('');

      stocksSection = `
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

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #95a5a6; font-size: 12px;">
                      <p>这是一封自动发送的邮件，请勿回复。</p>
                      <p>© ${new Date().getFullYear()} 价格监控系统 | Powered by Price Pole</p>
                    </div>
                  </div>
              </body>
            </html>
            `;
  }

  /**
   * 生成价格更新的纯文本邮件内容
   */
  private generatePriceUpdateText(priceData: PriceData): string {
    const updateTime = new Date(priceData.updateTime).toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
    });

    let content = `价格数据更新通知\n\n`;
    content += `更新时间：${updateTime}\n`;
    content += `数据来源：${priceData.source || '未知'}\n\n`;

    if (priceData.stocks && priceData.stocks.length > 0) {
      content += `【三大指数】\n`;
      priceData.stocks.forEach(stock => {
        const changeSign = stock.change >= 0 ? '+' : '';
        content += `${stock.name}：${stock.current.toFixed(2)} (${changeSign}${stock.change.toFixed(2)}, ${changeSign}${stock.percent.toFixed(2)}%)\n`;
      });
      content += `\n`;
    }

    if (priceData.gold) {
      const gold = priceData.gold;
      content += `【黄金价格】\n`;
      content += `品种：${gold.variety}\n`;
      content += `最新价：${gold.latestpri}\n`;
      content += `涨跌：${gold.limit}\n\n`;
    }

    if (priceData.exchangeRate) {
      const rate = priceData.exchangeRate;
      content += `【汇率信息】\n`;
      content += `货币对：${rate.currencyF_Name} → ${rate.currencyT_Name}\n`;
      content += `汇率：${rate.exchange}\n\n`;
    }

    content += `---\n`;
    content += `这是一封自动发送的邮件，请勿回复。\n`;
    content += `© ${new Date().getFullYear()} 价格监控系统 | Powered by Price Pole`;

    return content;
  }
}
