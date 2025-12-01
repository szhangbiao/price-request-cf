import { Context } from 'hono';
import { EmailService } from '../service/emailService';
import { Env } from '../types/price';
import { PriceHandler } from './priceHandler';

/**
 * 发送测试邮件的处理函数
 * @param c Hono Context
 */
export async function sendEmail(c: Context<{ Bindings: Env }>) {
    try {
        const email = c.req.query('email');
        if (!email) {
            return c.json({
                success: false,
                message: '请提供 email 参数',
                timestamp: Date.now()
            }, 400);
        }
        const isHtml = c.req.query('isHtml') === 'true';
        const forceRefresh = c.req.query('forceRefresh') === 'true';
        const priceHandler = new PriceHandler(c.env);
        const data = await priceHandler.getPriceData('request_data', forceRefresh);
        if (!data) {
            return c.json({
                success: false,
                message: '无法获取价格数据',
                timestamp: Date.now()
            }, 400);
        }
        const emailService = new EmailService('noreply@szhangbiao.cn');
        const emailSent = isHtml ? await emailService.sendPriceHtmlEmail(email, data) : await emailService.sendPriceTextEmail(email, data);
        if (emailSent) {
            return c.json({
                success: true,
                message: '测试邮件发送成功',
                timestamp: Date.now()
            });
        } else {
            return c.json({
                success: false,
                message: '测试邮件发送失败',
                timestamp: Date.now()
            }, 500);
        }
    } catch (error) {
        return c.json({
            success: false,
            message: '服务器内部错误',
            error: error instanceof Error ? error.message : '未知错误',
            timestamp: Date.now()
        }, 500);
    }
}
