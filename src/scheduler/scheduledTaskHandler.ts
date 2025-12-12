import { PriceHandler } from '../handler/priceHandler';
import { EmailService } from '../service/emailService';

/**
 * 检查是否应该跳过当前触发时间
 * @param scheduledTime 触发时间戳
 * @returns true 表示应该跳过，false 表示应该执行
 */
function shouldSkipScheduledTask(scheduledTime: number): boolean {
    const now = new Date(scheduledTime);
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();

    // 跳过上午 9:00（UTC 01:00）
    if (utcHour === 1 && utcMinute === 0) {
        console.log('跳过上午 9:00 的触发');
        return true;
    }

    return false;
}

/**
 * 检查是否需要发送邮件
 * @param scheduledTime 触发时间戳
 * @returns true 表示需要发送邮件
 */
function shouldSendEmail(scheduledTime: number): boolean {
    const now = new Date(scheduledTime);
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();

    // 北京时间 14:50（UTC 6:50）发送邮件
    return utcHour === 6 && utcMinute === 50;
}

/**
 * 处理定时任务
 */
export async function handleScheduledTask(event: ScheduledEvent, env: CloudflareBindings): Promise<void> {
    console.log('定时任务触发，开始刷新价格数据...');
    console.log('触发时间:', new Date(event.scheduledTime).toISOString());

    // 检查是否应该跳过此次触发
    if (shouldSkipScheduledTask(event.scheduledTime)) {
        return;
    }

    const priceHandler = new PriceHandler(env);

    // 强制刷新价格数据（跳过缓存，从 API 获取最新数据）
    const data = await priceHandler.getPriceData('request_data', true);

    if (!data) {
        console.error('定时任务执行失败，无法获取价格数据');
        return;
    }

    console.log('定时任务执行成功，价格数据已更新');
    console.log('数据来源:', data.source);

    // 检查是否需要发送邮件
    if (shouldSendEmail(event.scheduledTime)) {
        console.log('触发每日邮件发送任务...');
        const emailService = new EmailService();
        const emailSent = await emailService.sendPriceHtmlEmail('shizhangbiao@booslink.cn', data);

        if (emailSent) {
            console.log('每日价格更新邮件发送成功');
        } else {
            console.error('每日价格更新邮件发送失败');
        }
    }
}
