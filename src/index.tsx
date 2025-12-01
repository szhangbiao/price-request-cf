import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import staticRouter from './routes/static';
import mainRouter from './routes/index';
import apiRouter from './routes/api';
import { PriceHandler } from './handler/priceHandler';
import { EmailService } from './service/emailService';
import { errorResponse } from './utils/response';

const app = new Hono<{ Bindings: CloudflareBindings }>();

// 全局中间件
app.use('*', logger());
app.use('*', cors());

// 路由
app.route('/', staticRouter);  // 静态资源路由（优先级最高）
app.route('/', mainRouter);    // 主页面路由
app.route('/api', apiRouter);  // API 路由

/**
 * 404 处理
 */
app.notFound((c) => {
    return c.json(
        {
            ...errorResponse('Not Found'),
            path: c.req.path,
        },
        404
    );
});

/**
 * 全局错误处理
 */
app.onError((err, c) => {
    console.error('Error:', err);
    return c.json(
        errorResponse(err.message || 'Internal Server Error'),
        500
    );
});

// 导出 Worker 的处理器
export default {
    // HTTP 请求处理器
    fetch: app.fetch,

    // 定时任务处理器
    async scheduled(event: ScheduledEvent, env: CloudflareBindings, ctx: ExecutionContext) {
        console.log('定时任务触发，开始刷新价格数据...');
        console.log('触发时间:', new Date(event.scheduledTime).toISOString());

        try {
            const priceHandler = new PriceHandler(env);

            // 强制刷新价格数据（跳过缓存，从 API 获取最新数据）
            const data = await priceHandler.getPriceData('request_data', true);

            if (data) {
                console.log('定时任务执行成功，价格数据已更新');
                console.log('数据来源:', data.source);

                // 检查当前时间是否为北京时间 14:50（UTC 6:50）
                const now = new Date(event.scheduledTime);
                const utcHour = now.getUTCHours();
                const utcMinute = now.getUTCMinutes();

                // 如果是 UTC 6:50（北京时间 14:50），发送邮件
                if (utcHour === 6 && utcMinute === 50) {
                    console.log('触发每日邮件发送任务...');
                    const emailService = new EmailService(
                        'noreply@szhangbiao.cn',
                        '价格监控系统'
                    );
                    const emailSent = await emailService.sendPriceUpdateEmail(
                        'szhangbiao@gmail.com',
                        data
                    );
                    if (emailSent) {
                        console.log('每日价格更新邮件发送成功');
                    } else {
                        console.error('每日价格更新邮件发送失败');
                    }
                }
            } else {
                console.error('定时任务执行失败，无法获取价格数据');
            }
        } catch (error) {
            console.error('定时任务执行出错:', error);
        }
    }
};

