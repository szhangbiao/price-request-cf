import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import staticRouter from './routes/static';
import mainRouter from './routes/index';
import apiRouter from './routes/api';

const app = new Hono<{ Bindings: CloudflareBindings }>();

// 全局中间件
app.use('*', logger());
app.use('*', cors());

// 路由
app.route('/', staticRouter);  // 静态资源路由（优先级最高）
app.route('/', mainRouter);    // 主页面路由
app.route('/api', apiRouter);  // API 路由

export default app;
