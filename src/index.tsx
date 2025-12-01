import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import staticRouter from './routes/static';
import mainRouter from './routes/index';
import apiRouter from './routes/api';
import { errorResponse } from './utils/response';
import { handleScheduledTask } from './scheduler/scheduledTaskHandler';

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
        try {
            await handleScheduledTask(event, env);
        } catch (error) {
            console.error('定时任务执行出错:', error);
        }
    }
};

