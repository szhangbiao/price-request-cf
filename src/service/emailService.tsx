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
   * @param templateType 模板类型，默认为 'default'
   */
  async sendPriceHtmlEmail(to: string, priceData: PriceData, templateType: 'default' | 'minimal' = 'default'): Promise<boolean> {
    const subject = `价格数据更新通知 - ${new Date(priceData.updateTime).toLocaleString('zh-CN')}`;

    // 使用模板系统生成 HTML 内容
    const { createEmailTemplate, TemplateType } = await import('./templates');
    const type = templateType === 'minimal' ? TemplateType.MINIMAL : TemplateType.DEFAULT;
    const template = createEmailTemplate(type);

    const htmlContent = template.generateHtml({
      priceData,
      updateTime: priceData.updateTime,
    });

    return await this.sendHtmlEmail(to, subject, htmlContent);
  }

  /**
   * 发送价格数据更新通知给多个收件人
   * @param recipients 收件人列表
   * @param priceData 价格数据
   * @param templateType 模板类型，默认为 'default'
   */
  async sendPriceUpdateToMultiple(recipients: Array<{ email: string; name?: string }>, priceData: PriceData, templateType: 'default' | 'minimal' = 'default'): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const recipient of recipients) {
      const result = await this.sendPriceHtmlEmail(recipient.email, priceData, templateType);
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
