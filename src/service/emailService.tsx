import { PriceData, GoldData, ExchangeRateData } from '../types/price';

/**
 * 邮件发送服务
 * 使用 MailChannels API 发送邮件
 * MailChannels 与 Cloudflare Workers 深度集成，免费额度：每天 10,000 封邮件
 */
export class EmailService {
  private readonly SENDGRID_API = 'https://api.sendgrid.com/v3/mail/send';
  private fromEmail: string;
  private fromName: string;
  private apiKey?: string;

  constructor(
    fromEmail: string = 'noreply@yourdomain.com',
    fromName: string = '价格监控系统',
    apiKey?: string
  ) {
    this.fromEmail = fromEmail;
    this.fromName = fromName;
    // 仅使用构造函数传入的 API Key；在 Workers 中请通过 env 注入
    this.apiKey = apiKey;
  }

  /**
   * 发送纯文本邮件
   * @param to 收件人邮箱
   * @param subject 邮件主题
   * @param content 邮件内容（纯文本）
   * @param toName 收件人姓名（可选）
   */
  async sendTextEmail(
    to: string,
    subject: string,
    content: string,
    toName?: string
  ): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.error('缺少 SendGrid API Key，请在构造 EmailService 时传入。');
        return false;
      }

      const response = await fetch(this.SENDGRID_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to, name: toName || to }],
            },
          ],
          from: {
            email: this.fromEmail,
            name: this.fromName,
          },
          subject: subject,
          content: [
            {
              type: 'text/plain',
              value: content,
            },
          ],
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
   * @param textContent 纯文本内容（备用）
   * @param toName 收件人姓名（可选）
   */
  async sendHtmlEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string,
    toName?: string
  ): Promise<boolean> {
    try {
      const content = [];

      // 添加纯文本版本（作为备用）
      if (textContent) {
        content.push({
          type: 'text/plain',
          value: textContent,
        });
      }

      // 添加 HTML 版本
      content.push({
        type: 'text/html',
        value: htmlContent,
      });

      if (!this.apiKey) {
        console.error('缺少 SendGrid API Key，请在构造 EmailService 时传入。');
        return false;
      }

      const response = await fetch(this.SENDGRID_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to, name: toName || to }],
            },
          ],
          from: {
            email: this.fromEmail,
            name: this.fromName,
          },
          subject: subject,
          content: content,
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

  /**
   * 发送价格数据更新通知邮件
   * @param to 收件人邮箱
   * @param priceData 价格数据
   * @param toName 收件人姓名（可选）
   */
  async sendPriceUpdateEmail(
    to: string,
    priceData: PriceData,
    toName?: string
  ): Promise<boolean> {
    const subject = `价格数据更新通知 - ${new Date(priceData.updateTime).toLocaleString('zh-CN')}`;

    // 生成 HTML 内容
    const htmlContent = this.generatePriceUpdateHtml(priceData);

    // 生成纯文本内容（备用）
    const textContent = this.generatePriceUpdateText(priceData);

    return await this.sendHtmlEmail(to, subject, htmlContent, textContent, toName);
  }

  /**
   * 发送价格数据更新通知给多个收件人
   * @param recipients 收件人列表
   * @param priceData 价格数据
   */
  async sendPriceUpdateToMultiple(
    recipients: Array<{ email: string; name?: string }>,
    priceData: PriceData
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const recipient of recipients) {
      const result = await this.sendPriceUpdateEmail(
        recipient.email,
        priceData,
        recipient.name
      );

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
      goldSection = `
        <div style="margin: 20px 0; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
          <h3 style="margin-top: 0; color: #856404;">📊 黄金价格</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>品种：</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${gold.variety}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>最新价：</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #d9534f; font-weight: bold;">${gold.latestpri}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>开盘价：</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${gold.openpri}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>最高价：</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${gold.maxpri}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>最低价：</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${gold.minpri}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>昨收价：</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${gold.yespri}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>涨跌：</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${gold.limit}</td>
            </tr>
            <tr>
              <td style="padding: 8px;"><strong>成交量：</strong></td>
              <td style="padding: 8px;">${gold.totalvol}</td>
            </tr>
          </table>
        </div>
      `;
    }

    let exchangeRateSection = '';
    if (priceData.exchangeRate) {
      const rate = priceData.exchangeRate;
      exchangeRateSection = `
        <div style="margin: 20px 0; padding: 15px; background-color: #d1ecf1; border-left: 4px solid #17a2b8; border-radius: 4px;">
          <h3 style="margin-top: 0; color: #0c5460;">💱 汇率信息</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>货币对：</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${rate.currencyF_Name} → ${rate.currencyT_Name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>汇率：</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #17a2b8; font-weight: bold;">${rate.exchange}</td>
            </tr>
            <tr>
              <td style="padding: 8px;"><strong>更新时间：</strong></td>
              <td style="padding: 8px;">${rate.updateTime}</td>
            </tr>
          </table>
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

          ${goldSection}
          ${exchangeRateSection}

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #95a5a6; font-size: 12px;">
            <p>这是一封自动发送的邮件，请勿回复。</p>
            <p>© ${new Date().getFullYear()} 价格监控系统 | Powered by Cloudflare Workers</p>
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

    if (priceData.gold) {
      const gold = priceData.gold;
      content += `【黄金价格】\n`;
      content += `品种：${gold.variety}\n`;
      content += `最新价：${gold.latestpri}\n`;
      content += `开盘价：${gold.openpri}\n`;
      content += `最高价：${gold.maxpri}\n`;
      content += `最低价：${gold.minpri}\n`;
      content += `昨收价：${gold.yespri}\n`;
      content += `涨跌：${gold.limit}\n`;
      content += `成交量：${gold.totalvol}\n\n`;
    }

    if (priceData.exchangeRate) {
      const rate = priceData.exchangeRate;
      content += `【汇率信息】\n`;
      content += `货币对：${rate.currencyF_Name} → ${rate.currencyT_Name}\n`;
      content += `汇率：${rate.exchange}\n`;
      content += `更新时间：${rate.updateTime}\n\n`;
    }

    content += `---\n`;
    content += `这是一封自动发送的邮件，请勿回复。\n`;
    content += `© ${new Date().getFullYear()} 价格监控系统 | Powered by Cloudflare Workers`;

    return content;
  }
}
